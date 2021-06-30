using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMR_API.Helpers;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using DMR_API._Repositories.Interface;
using DMR_API._Services.Interface;
using DMR_API.DTO;
using DMR_API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using DMR_API.Helpers.Enum;
using System.Transactions;
using DMR_API.Data;

namespace DMR_API._Services.Services
{
    public class ModelNameService : IModelNameService
    {
        private readonly IModelNameRepository _repoModelName;
        private readonly IGlueIngredientRepository _repoGlueIngredient;
        private readonly IGlueRepository _repoGlue;
        private readonly IArticleNoRepository _repoArticleNo;
        private readonly IProcessRepository _repoProcess;
        private readonly IArtProcessRepository _repoArtProcess;
        private readonly IIngredientRepository _repoIngredient;
        private readonly ISupplierRepository _supplierRepository;
        private readonly IBPFCEstablishRepository _repoBPFC;
        private readonly IPlanRepository _repoPlan;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IModelNoRepository _repoModelNO;
        private readonly IMailExtension _mailExtension;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly MapperConfiguration _configMapper;
        public ModelNameService(
            IModelNameRepository repoBrand,
            IGlueRepository repoGlue,
            IGlueIngredientRepository repoGlueIngredient,
            IMailExtension mailExtension,
            IArticleNoRepository repoArticleNo,
            IProcessRepository repoProcess,
            IArtProcessRepository repoArtProcess,
            IIngredientRepository repoIngredient,
            IBPFCEstablishRepository repoBPFC,
            IModelNoRepository repoModelNO,
            ISupplierRepository supplierRepository,
            IConfiguration configuration,
            IPlanRepository repoPlan,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            MapperConfiguration configMapper)
        {
            _configMapper = configMapper;
            _mapper = mapper;
            _repoModelName = repoBrand;
            _repoGlueIngredient = repoGlueIngredient;
            _repoGlue = repoGlue;
            _repoModelNO = repoModelNO;
            _repoArticleNo = repoArticleNo;
            _repoProcess = repoProcess;
            _repoArtProcess = repoArtProcess;
            _repoBPFC = repoBPFC;
            _repoIngredient = repoIngredient;
            _supplierRepository = supplierRepository;
            _configuration = configuration;
            _mailExtension = mailExtension;
            _repoPlan = repoPlan;
            _unitOfWork = unitOfWork;
        }

        public async Task<ArticleNo> FindArticleNoByCloneDto(CloneDto clone)
        {
            var artNo = await _repoArticleNo.FindAll().FirstOrDefaultAsync(x => x.ModelNoID == clone.ModelNOID && x.Name.ToLower() == clone.Name.ToLower());
            if (artNo != null)
            {
                return artNo;
            }
            else
            {
                var artNoData = new ArticleNo();
                artNoData.ModelNoID = clone.ModelNOID;
                artNoData.Name = clone.Name;
                _repoArticleNo.Add(artNoData);
                await _repoArticleNo.SaveAll();
                return artNoData;
            }
        }
        // new version
        public async Task<object> CloneBPFC(CloneDto clone)
        {
            try
            {
                // Tim cai source

                // Kiem tra neu aricle trung thi k cho clone

                // tao moi BPFC

                // tao moi articleNO cha cua artprocess

                // tao artprocess

                // Clone Glue 

                var bpfc = await _repoBPFC.FindAll()
                .Include(x => x.ModelName)
                .Include(x => x.ModelNo)
                .Include(x => x.ArtProcess)
                .Include(x => x.ArticleNo)
                .Include(x => x.Glues).ThenInclude(x => x.GlueIngredients)
                .Include(x => x.Plans)
                .FirstOrDefaultAsync(x => x.ID == clone.BPFCID); // chua glue 

                var artNo = await FindArticleNoByCloneDto(clone);
                clone.ArticleNOID = artNo.ID;
                var artProcess = await FindArtProcessByCloneDto(clone);
                var bpfcForClone = await FindBPFCDestination(clone, artProcess);
                // Not exists bpfc -> add new -> clone 
                if (bpfcForClone == null)
                {
                    clone.ApprovalBy = bpfc.ApprovalBy;
                    var bpfcClone = await CreateNewBPFCDestination(clone, artProcess.ID);
                    await CloneNewGlueByCloneDto(clone, bpfc, bpfcClone);
                }
                else
                {
                    await CloneNewGlueByCloneDto(clone, bpfc, bpfcForClone);
                }
                return new
                {
                    message = "The BPFC has been cloned!",
                    status = true
                };
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("Loi clone model name", ex);
                return new
                {
                    message = "",
                    status = false
                };
            }
        }
        //Thêm Brand mới vào bảng ModelName
        public async Task<bool> Add(ModelNameDto model)
        {
            var ModelName = _mapper.Map<ModelName>(model);
            _repoModelName.Add(ModelName);
            return await _repoModelName.SaveAll();
        }

        //Lấy danh sách Brand và phân trang
        public async Task<PagedList<ModelNameDto>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoModelName.FindAll().ProjectTo<ModelNameDto>(_configMapper).OrderByDescending(x => x.ID);
            return await PagedList<ModelNameDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }

        //Tìm kiếm ModelName
        public async Task<PagedList<ModelNameDto>> Search(PaginationParams param, object text)
        {
            var lists = _repoModelName.FindAll().ProjectTo<ModelNameDto>(_configMapper)
            .Where(x => x.Name.Contains(text.ToString()))
            .OrderByDescending(x => x.ID);
            return await PagedList<ModelNameDto>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        //Xóa Brand
        public async Task<bool> Delete(object id)
        {
            var ModelName = _repoModelName.FindById(id);
            _repoModelName.Remove(ModelName);
            return await _repoModelName.SaveAll();
        }

        //Cập nhật Brand
        public async Task<bool> Update(ModelNameDto model)
        {
            var ModelName = _mapper.Map<ModelName>(model);
            _repoModelName.Update(ModelName);
            return await _repoModelName.SaveAll();
        }

        //Lấy toàn bộ danh sách Brand 
        public async Task<List<ModelNameDto>> GetAllAsync()
        {
            var lists = await _repoModelName.FindAll().ProjectTo<ModelNameDto>(_configMapper).OrderBy(x => x.Name).ToListAsync();
            return lists;
        }
        //Lấy toàn bộ danh sách Brand 
        public async Task<List<ModelNameDto>> GetAllAsyncForAdmin()
        {
            var lists = await _repoModelName.FindAll().ProjectTo<ModelNameDto>(_configMapper).OrderByDescending(x => x.ID).ToListAsync();
            return lists;
        }

        //Lấy Brand theo Brand_Id
        public ModelNameDto GetById(object id)
        {
            return _mapper.Map<ModelName, ModelNameDto>(_repoModelName.FindById(id));
        }

     
        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task SendMailForPIC(string email)
        {
            string subject = "(SHC-902) DMR System - Notification";
            string url = _configuration["MailSettings:API_URL"].ToSafetyString();
            string message = @"
                Notification from Digital Mixing Room <br />
                <b>*PLEASE DO NOT REPLY*</b> this email was automatically sent from the Digital Mixing Room <br />
                The model name has been rejected by suppervisor!!!<br />";
            message += $"<a href='{url}'>Click here to go to the system</a>";
            var emails = new List<string> { email };

            await _mailExtension.SendEmailRangeAsync(emails, subject, message);
        }




        public async Task<bool> CloneModelName(int modelNameID, int modelNOID, int articleNOID, int processID)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();
            {
                try
                {
                    
                        var bpfc = await _repoBPFC.FindAll()
                                            .Include(x => x.ModelName)
                                            .Include(x => x.ModelNo)
                                            .Include(x => x.ArtProcess)
                                            .Include(x => x.ArticleNo)
                                            .Include(x => x.Glues.Where(x => x.isShow == true))
                                            .Include(x => x.Plans)
                                            .FirstOrDefaultAsync(x => x.ModelNameID == modelNameID
                                        && x.ModelNoID == modelNOID
                                        && x.ArticleNoID == articleNOID
                                        && x.ArtProcessID == processID);
                        if (bpfc == null) return false;
                        var modelNameData = bpfc.ModelName;
                        modelNameData.ID = 0;
                        _repoModelName.Add(modelNameData);
                        await _repoModelName.SaveAll();

                        var modelNoData = bpfc.ModelNo;
                        modelNoData.ID = 0;
                        modelNoData.ModelNameID = modelNameData.ID;
                        _repoModelNO.Add(modelNoData);
                        await _repoModelNO.SaveAll();

                        var articleNOData = bpfc.ArticleNo;
                        articleNOData.ID = 0;
                        articleNOData.ModelNoID = modelNoData.ID;
                        _repoArticleNo.Add(articleNOData);
                        await _repoArticleNo.SaveAll();

                        var artProcessData = bpfc.ArtProcess;
                        artProcessData.ID = 0;
                        artProcessData.ArticleNoID = articleNOData.ID;
                        _repoArtProcess.Add(artProcessData);
                        await _repoArtProcess.SaveAll();

                        var bpfcData = bpfc;
                        bpfcData.ModelName = null;
                        bpfcData.ModelNo = null;
                        bpfcData.ArticleNo = null;
                        bpfcData.ArtProcess = null;
                        bpfcData.Glues = null;
                        bpfcData.Plans = null;
                        bpfcData.ID = 0;
                        bpfcData.ModelNameID = modelNameData.ID;
                        bpfcData.ModelNoID = modelNoData.ID;
                        bpfcData.ArticleNoID = articleNOData.ID;
                        bpfcData.ArtProcessID = artProcessData.ID;
                        _repoBPFC.Add(bpfcData);
                        await _repoBPFC.SaveAll();

                        var gluesData = bpfc.Glues.ToList();
                        gluesData.ForEach(item =>
                        {
                            item.ID = 0;
                            item.BPFCEstablishID = bpfcData.ID;
                        });

                        _repoGlue.AddRange(gluesData);
                        await _repoGlue.SaveAll();

                        var planData = bpfc.Plans.ToList();
                        planData.ForEach(item =>
                        {
                            item.ID = 0;
                            item.BPFCEstablishID = bpfcData.ID;
                        });

                        _repoPlan.AddRange(planData);
                        await _repoPlan.SaveAll();
                        await transaction.CommitAsync();
                    
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("Loi clone model name", ex);
                    return false;
                }
            } 
        }
        private async Task<string> GenatateGlueCode(string code)
        {
            int lenght = 8;
            if (await _repoGlue.FindAll().AnyAsync(x => x.isShow == true && x.Code.Equals(code)) == true)
            {
                var newCode = RandomString(lenght);
                return await GenatateGlueCode(newCode);
            }
            return code;

        }
        private async Task<bool> CheckExistBPFC(CloneDto model)
        {
            var bpfc = await _repoBPFC.FindAll().AnyAsync(x => x.ModelNameID == model.ModelNameID
                                 && x.ModelNoID == model.ModelNOID
                                 && x.ArticleNoID == model.ArticleNOID
                                 && x.ArtProcessID == model.ArtProcessID);
            return bpfc;
        }
        public async Task<BPFCEstablish> CreateNewBPFCDestination(CloneDto model, int artProcessID)
        {

            var bpfcData = new BPFCEstablish();
            bpfcData.ModelNameID = model.ModelNameID;
            bpfcData.ModelNoID = model.ModelNOID;

            bpfcData.ArticleNoID = model.ArticleNOID;
            bpfcData.ArtProcessID = artProcessID;

            bpfcData.ApprovalStatus = false;
            bpfcData.FinishedStatus = false;
            bpfcData.ApprovalBy = model.ApprovalBy;
            bpfcData.CreatedBy = model.CloneBy;
            bpfcData.UpdateTime = DateTime.Now;
            bpfcData.BuildingDate = DateTime.Now;
            bpfcData.CreatedDate = DateTime.Now;
            _repoBPFC.Add(bpfcData);
            await _repoBPFC.SaveAll();
            return bpfcData;
        }
        /// <summary>
        /// Chuyển keo từ bpfcSourceClone -> bpfcDestination
        /// </summary>
        /// <param name="clone"></param>
        /// <param name="bpfcDestination"></param>
        /// <param name="bpfcSourceClone"></param>
        /// <returns></returns>
        public async Task ExportGlueFromBPFCSourceToBPFCDestination(int cloneBy, BPFCEstablish bpfcDestination, BPFCEstablish bpfcSource)
        {
            // Tìm keo(Glue) trong BPFC đích (BPFC Destination)
            // Nếu tồn tại keo thì xóa hết.
            var checkExist = await _repoGlue.FindAll().Where(x => x.BPFCEstablishID == bpfcDestination.ID && x.isShow == true).ToListAsync();
            if (checkExist.Count > 0)
            {
                _repoGlue.RemoveMultiple(checkExist);
                await _repoGlue.SaveAll();
            }

            // Lấy keo của BPFC nguồn (BPFC source)
            // Nếu nguồn k có keo thì thông báo không clone dc
            var gluesData = new List<Glue>();
            gluesData = bpfcSource.Glues.Where(x => x.isShow == true).ToList();
            if (gluesData.Count == 0)
                return;

            foreach (var item in gluesData)
            {

                var glue = new Glue();
                glue.Code = await this.GenatateGlueCode(item.Code);
                glue.Name = item.Name;
                glue.isShow = true;
                glue.Consumption = item.Consumption;
                glue.CreatedBy = cloneBy;
                glue.MaterialID = item.MaterialID;
                glue.KindID = item.KindID;
                glue.PartID = item.PartID;
                glue.GlueNameID = item.GlueNameID;
                glue.ExpiredTime = item.ExpiredTime;
                glue.BPFCEstablishID = bpfcDestination.ID;
                _repoGlue.Add(glue);

                await _repoGlue.SaveAll();

                var glueIngredients = item.GlueIngredients.ToList();
                var glueIngredientData = glueIngredients.Select(x => new GlueIngredient
                {
                    GlueID = glue.ID,
                    IngredientID = x.IngredientID,
                    Allow = x.Allow,
                    Percentage = x.Percentage,
                    CreatedDate = DateTime.Now.ToString("MMMM dd, yyyy HH:mm:ss tt"),
                    Position = x.Position,
                }).ToList();
                _repoGlueIngredient.AddRange(glueIngredientData);
                await _repoGlueIngredient.SaveAll();
            }
        }
        public async Task CloneNewGlueByCloneDto(CloneDto clone, BPFCEstablish bpfc, BPFCEstablish bpfcClone)
        {

            var gluesData = new List<Glue>();
            if (bpfcClone.Glues == null)
            {
                gluesData = bpfc.Glues.Where(x => x.isShow == true).ToList();
            }
            else
            {
                var list2 = bpfcClone.Glues.Where(x => x.isShow == true).Select(x => x.Name);
                var list1 = bpfc.Glues.Where(x => x.isShow == true).Select(x => x.Name);
                var check = list1.Except(list2);
                gluesData = bpfc.Glues.Where(x => x.isShow == true && check.Contains(x.Name)).ToList();
            }
            if (gluesData.Count == 0)
                return;
            foreach (var item in gluesData)
            {
                var glue = new Glue();
                glue.Code = await this.GenatateGlueCode(item.Code);
                glue.Name = item.Name;
                glue.isShow = true;
                glue.Consumption = item.Consumption;
                glue.CreatedBy = clone.CloneBy;
                glue.MaterialID = item.MaterialID;
                glue.KindID = item.KindID;
                glue.PartID = item.PartID;
                glue.GlueNameID = item.GlueNameID;
                glue.ExpiredTime = item.ExpiredTime;
                glue.BPFCEstablishID = bpfcClone.ID;
                _repoGlue.Add(glue);
                await _repoGlue.SaveAll();

                var glueIngredients = item.GlueIngredients.ToList();
                var glueIngredientData = glueIngredients.Select(x => new GlueIngredient
                {
                    GlueID = glue.ID,
                    IngredientID = x.IngredientID,
                    Allow = x.Allow,
                    Percentage = x.Percentage,
                    CreatedDate = DateTime.Now.ToString("MMMM dd, yyyy HH:mm:ss tt"),
                    Position = x.Position,
                }).ToList();
                _repoGlueIngredient.AddRange(glueIngredientData);
                await _repoGlueIngredient.SaveAll();
            }
        }
        /// <summary>
        /// Tìm artprocess theo articleNoID và processID (artProcessID) đc gửi từ client
        /// Nếu chưa có thì thêm mới
        /// </summary>
        /// <param name="clone"> clone.ArtProcess đây là ProcessID hiện tại hệ thống chỉ có 2 process STF, ASY</param>
        /// <returns>Trả về ArtProcess</returns>
        public async Task<ArtProcess> FindArtProcessByCloneDto(CloneDto clone)
        {
            var artProcess = await _repoArtProcess.FindAll().FirstOrDefaultAsync(x => x.ArticleNoID == clone.ArticleNOID && x.ProcessID == clone.ArtProcessID);
            if (artProcess != null)
                return artProcess;
            else
            {
                var artProcessData = new ArtProcess();
                artProcessData.ArticleNoID = clone.ArticleNOID;
                artProcessData.ProcessID = clone.ArtProcessID;
                _repoArtProcess.Add(artProcessData);
                await _repoGlueIngredient.SaveAll();
                return artProcessData;
            }
        }
        /// <summary>
        /// Tìm BPFC đích (BPFC Destination)
        /// </summary>
        /// <param name="clone"></param>
        /// <param name="artProcess"></param>
        /// <returns></returns>
        public async Task<BPFCEstablish> FindBPFCDestination(CloneDto clone, ArtProcess artProcess)
        {
            var bpfcForClone = await _repoBPFC.FindAll()
                                              .Include(x => x.ModelName)
                                              .Include(x => x.ModelNo)
                                              .Include(x => x.ArtProcess)
                                              .Include(x => x.ArticleNo)
                                              .Include(x => x.Glues)
                                              .ThenInclude(x => x.GlueIngredients)
                                              .Include(x => x.Plans)
                                              .FirstOrDefaultAsync(x => x.ModelNameID == clone.ModelNameID
                                                                                              && x.ModelNoID == clone.ModelNOID
                                                                                              && x.ArticleNoID == clone.ArticleNOID
                                                                                          && x.ArtProcessID == artProcess.ID);
            return bpfcForClone;
        }
        /// <summary>CloneGlueByCloneDto
        /// FlowChart
        /// B1: Chọn BPFC nguồn và chọn ModelNameID, ModelNoID, ArticleNoID, Process
        /// B2: Kiểm tra BPFC nguồn có trong db chưa. Nếu không tồn tại -> Kết thúc
        /// B3: 
        ///     Tìm ArtProcess theo ArticleNoID và ProcecssID -> Không tồn tại -> thêm mới -> Trả về ProcessID
        ///     Kiểm BPFC đích theo ModelNameID, ModelNoID, ArticleNoID, ArticleNoID, ProcessID có trong Db chưa -> Không tồn tại -> thêm mới -> trả về BPFC đích
        ///     Bước nhân bản: Xóa tất cả keo của BPFC đích -> Lấy tất cả keo của BPFC nguồn thêm vào BPFC đích
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public async Task<object> CloneModelName(CloneDto model)
        {
            using var transaction = await _unitOfWork.BeginTransactionAsync();
            {

                try
                {

                    //B1: Tìm bpfc nguồn
                    var bpfcSource = await _repoBPFC.FindAll()
                    .Include(x => x.ModelName)
                    .Include(x => x.ModelNo)
                    .Include(x => x.ArtProcess)
                    .Include(x => x.ArticleNo)
                    .Include(x => x.Glues).ThenInclude(x => x.GlueIngredients)
                    .Include(x => x.Plans)
                    .FirstOrDefaultAsync(x => x.ID == model.BPFCID);

                    // B2: Kiểm tra chưa có thì thông báo lỗi
                    if (bpfcSource == null)
                        return new
                        {
                            message = "The BPFC is invalid!",
                            status = false
                        };
                    // Nếu chưa tạo process thì tạo mới
                    var artProcess = await FindArtProcessByCloneDto(model);

                    // Tìm BPFC đích
                    var bpfcDestination = await FindBPFCDestination(model, artProcess);
                    // Nếu chưa có trong bảng BPFCEstablish thì thêm mới
                    if (bpfcDestination == null)
                    {
                        bpfcDestination = await CreateNewBPFCDestination(model, artProcess.ID);
                    }
                    // Nhân bản
                    await ExportGlueFromBPFCSourceToBPFCDestination(model.CloneBy, bpfcDestination, bpfcSource);

                   await  transaction.CommitAsync();

                    return new
                    {
                        message = "Đã nhân bản thành công! <br>The BPFC has been cloned!",
                        status = true
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine("Clone BPFC: ", ex);
                    return new
                    {
                        message = "Nhân bản không thành công! <br> Clone failed!",
                        status = false
                    };
                }
            }
        }

        /// <summary>
        /// Helper
        /// </summary>
        /// <param name="clone"></param>
        /// <param name="artProcess"></param>
        /// <returns></returns>
        public async Task<BPFCEstablish> FindBPFCByCloneDto(CloneDto clone, ArtProcess artProcess)
        {
            var bpfcForClone = await _repoBPFC.FindAll()
                                              .Include(x => x.ModelName)
                                              .Include(x => x.ModelNo)
                                              .Include(x => x.ArtProcess)
                                              .Include(x => x.ArticleNo)
                                              .Include(x => x.Glues)
                                              .ThenInclude(x => x.GlueIngredients)
                                              .Include(x => x.Plans)
                                              .FirstOrDefaultAsync(x => x.ModelNameID == clone.ModelNameID
                                                                                              && x.ModelNoID == clone.ModelNOID
                                                                                              && x.ArticleNoID == clone.ArticleNOID
                                                                                          && x.ArtProcessID == artProcess.ID);
            return bpfcForClone;
        }
        /// <summary>
        /// Helper
        /// </summary>
        /// <param name="clone"></param>
        /// <param name="artProcess"></param>
        /// <returns></returns>
        public async Task<BPFCEstablish> CreateNewBPFCByCloneDto(CloneDto clone, int artProcessID)
        {

            var bpfcData = new BPFCEstablish();
            bpfcData.ModelNameID = clone.ModelNameID;
            bpfcData.ModelNoID = clone.ModelNOID;

            bpfcData.ArticleNoID = clone.ArticleNOID;
            bpfcData.ArtProcessID = artProcessID;

            bpfcData.ApprovalStatus = false;
            bpfcData.FinishedStatus = false;
            bpfcData.ApprovalBy = clone.ApprovalBy;
            bpfcData.CreatedBy = clone.CloneBy;
            bpfcData.UpdateTime = DateTime.Now;
            bpfcData.BuildingDate = DateTime.Now;
            bpfcData.CreatedDate = DateTime.Now;
            _repoBPFC.Add(bpfcData);
            await _repoBPFC.SaveAll();
            return bpfcData;
        }
        /// <summary>
        /// B1: Tim BPFC nguồn
        /// B2: Tìm BPFC đích đến theo ModelNameID, ModelNoID, ArticleNoID , ProcessID, Nếu ArtProcessID k có trong db -> thêm mới
        /// b3: Clone -> Lấy glue của BPFC nguồn thêm vào BPFC đích
        /// </summary>
        /// <param name="clone">ModelNameID, ModelNoID, ArticleNoID , ProcessID</param>
        /// <returns></returns>
        public async Task<object> CloneModelNameForBPFCShcedule(CloneDto clone)
        {
                using var transaction = await _unitOfWork.BeginTransactionAsync();
                {
            try
            {

                    var bpfc = await _repoBPFC.FindAll()
                    .Include(x => x.ModelName)
                    .Include(x => x.ModelNo)
                    .Include(x => x.ArtProcess)
                    .Include(x => x.ArticleNo)
                    .Include(x => x.Glues).ThenInclude(x => x.GlueIngredients)
                    .Include(x => x.Plans)
                    .FirstOrDefaultAsync(x => x.ID == clone.BPFCID);
                    if (bpfc == null)
                        return new
                        {
                            message = "The BPFC is invalid!",
                            status = false
                        };
                    /// Case 1: 
                    // IF keep model Name
                    if (bpfc.ModelNameID == clone.ModelNameID)
                    {
                        /// Case 1.1: 
                        // Change model NO
                        if (bpfc.ModelNoID != clone.ModelNOID)
                        {
                            var artProcess = await FindArtProcessByCloneDto(clone);
                            var bpfcForClone = await FindBPFCByCloneDto(clone, artProcess);
                            // Not exists bpfc -> add new -> clone
                            if (bpfcForClone == null)
                            {
                                var bpfcClone = await CreateNewBPFCByCloneDto(clone, artProcess.ID);
                                await CloneGlueByCloneDto(clone, bpfc, bpfcClone);
                            }
                            else
                            {
                                await CloneGlueByCloneDto(clone, bpfc, bpfcForClone);
                            }
                        }
                        // IF keep model NO
                        if (bpfc.ModelNoID == clone.ModelNOID)
                        {
                            var artProcess = await FindArtProcessByCloneDto(clone);
                            var bpfcForClone = await FindBPFCByCloneDto(clone, artProcess);
                            if (bpfcForClone == null)
                            {
                                var bpfcClone = await CreateNewBPFCByCloneDto(clone, artProcess.ID);
                                await CloneGlueByCloneDto(clone, bpfc, bpfcClone);
                            }
                            else
                            {
                                clone.ArtProcessID = artProcess.ID;
                                await CloneGlueByCloneDto(clone, bpfcForClone, bpfc);
                            }
                        }
                    }
                    /// Case 2: 
                    // Change different ModelName
                    if (bpfc.ModelNameID != clone.ModelNameID)
                    {
                        var artProcess = await FindArtProcessByCloneDto(clone);
                        // Check BPFC
                        var bpfcForClone = await FindBPFCByCloneDto(clone, artProcess);
                        // Not exists bpfc -> add new BPFC -> CloneGlueByCloneDto
                        if (bpfcForClone == null)
                        {
                            var cloneBPFC = await CreateNewBPFCByCloneDto(clone, artProcess.ID);
                            await CloneGlueByCloneDto(clone, bpfc, cloneBPFC);
                        }
                        else
                        {
                            await CloneGlueByCloneDto(clone, bpfcForClone, bpfc);
                        }
                    }
                   await transaction.CommitAsync();
                return new
                {
                    message = "The BPFC has been cloned!",
                    status = true
                };
            }
            catch (Exception ex)
            {
                   await transaction.RollbackAsync();
                Console.WriteLine("Loi clone model name", ex);
                return new
                {
                    message = "",
                    status = false
                };
                }
            }
        }
        public async Task CloneGlueByCloneDto(CloneDto clone, BPFCEstablish bpfcDestination, BPFCEstablish bpfcSourceClone)
        {

            var gluesData = new List<Glue>();
            gluesData = bpfcSourceClone.Glues.Where(x => x.isShow == true).ToList();

            var checkExist = _repoGlue.FindAll().Where(x => x.BPFCEstablishID == bpfcDestination.ID && x.isShow == true).ToList();
            if (checkExist != null)
            {
                _repoGlue.RemoveMultiple(checkExist);
                await _repoGlue.SaveAll();
            }

            if (gluesData.Count == 0)
                return;

            foreach (var item in gluesData)
            {

                var glue = new Glue();
                glue.Code = await this.GenatateGlueCode(item.Code);
                glue.Name = item.Name;
                glue.isShow = true;
                glue.Consumption = item.Consumption;
                glue.CreatedBy = clone.CloneBy;
                glue.MaterialID = item.MaterialID;
                glue.KindID = item.KindID;
                glue.PartID = item.PartID;
                glue.GlueNameID = item.GlueNameID;
                glue.ExpiredTime = item.ExpiredTime;
                glue.BPFCEstablishID = bpfcDestination.ID;
                _repoGlue.Add(glue);

                await _repoGlue.SaveAll();

                var glueIngredients = item.GlueIngredients.ToList();
                var glueIngredientData = glueIngredients.Select(x => new GlueIngredient
                {
                    GlueID = glue.ID,
                    IngredientID = x.IngredientID,
                    Allow = x.Allow,
                    Percentage = x.Percentage,
                    CreatedDate = DateTime.Now.ToString("MMMM dd, yyyy HH:mm:ss tt"),
                    Position = x.Position,
                }).ToList();
                _repoGlueIngredient.AddRange(glueIngredientData);
                await _repoGlueIngredient.SaveAll();
            }
        }
    }
}