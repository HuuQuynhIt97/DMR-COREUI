using DMR_API.DTO;
using DMR_API.Helpers.Enum;
using DMR_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API._Services.Interface
{
    public interface IBPFCEstablishService : IECService<BPFCEstablishDto>
    {
        Task<object> GetDetailBPFC(int bpfcID);
        /// <summary>
        /// Lấy tất cả danh sách BPFC đã xong
        /// </summary>
        /// <returns></returns>
        Task<object> GetDoneBPFC();
        /// <summary>
        /// Lấy tất cả danh sách BPFC chưa xong
        /// </summary>
        /// <returns></returns>
        Task<object> GetUndoneBPFC();
        Task ImportExcel(List<BPFCEstablishDtoForImportExcel> bPFCEstablishDtos);
        /// <summary>
        /// Duyệt tạo công thức keo theo mẫu giầy
        /// </summary>
        /// <param name="bpfcID">ID của bảng thông tin tổng hợp (BPFC)</param>
        /// <param name="userid">ID của người dùng</param>
        /// <returns></returns>
        Task<object> Approval(int bpfcID, int userid);

        /// <summary>
        /// Tạo xong công thức keo theo mẫu giầy
        /// </summary>
        /// <param name="bpfcID">ID của bảng thông tin tổng hợp (BPFC)</param>
        /// <param name="userid">ID của người dùng</param>
        /// <returns></returns>
        Task<object> Done(int bpfcID, int userid);

        /// <summary>
        /// Duyệt tạo công thức keo theo mẫu giầy
        /// </summary>
        /// <param name="bpfcID">ID của bảng thông tin tổng hợp (BPFC)</param>
        /// <param name="userid">ID của người dùng</param>
        /// <returns></returns>
        Task<object> Release(int bpfcID, int userid);
        /// <summary>
        /// Từ chối thông tin tổng hợp. Gửi mail cho người đã tạo ra dữ liệu này
        /// </summary>
        /// <param name="bpfcID">ID của bảng thông tin tổng hợp (BPFC)</param>
        /// <param name="userid">ID của người dùng</param>
        /// <returns></returns>
        Task<object> Reject(int bpfcID, int userid);
        /// <summary>
        /// Gửi mail cho người chịu trách nhiệm
        /// </summary>
        /// <param name="email"></param>
        /// <returns></returns>
        Task SendMailForPIC(string email);

        /// <summary>
        /// Lấy danh sách lịch sử đã thao tác trên trang BPFCSheduleDetail
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCHistoryDto>> GetAllHistoryAsync();

        Task<bool> Create(BPFCHistoryDto entity);
        Task<bool> UpdateBPFCHistory(BPFCHistory entity);
        Task<object> LoadBPFCHistory(int bpfcID);

        /// <summary>
        /// Lấy danh sách theo trạng thái đã được duyệt
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> FilterByApprovedStatus();
        /// <summary>
        /// Lấy danh sách theo trạng thái đã hoàn thành
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> FilterByFinishedStatus();

        /// <summary>
        /// Lấy danh sách theo trạng thái chưa dc duyệt
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> FilterByNotApprovedStatus();

        /// <summary>
        /// Lấy tất cả danh sách 
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> DefaultFilter();

        /// <summary>
        /// Lấy tất cả danh sách bị từ chối 
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> RejectedFilter();

        /// <summary>
        /// Lấy tất cả danh sách BPFCSchedule
        /// </summary>
        /// <param name="status">Trạng thái</param>
        /// <param name="startBuildingDate">Thời gian bắt đầu</param>
        /// <param name="endBuildingDate">Thời gian kết thúc</param>
        /// <returns></returns>
        Task<List<BPFCRecordDto>> GetAllBPFCRecord(Status status, string startBuildingDate, string endBuildingDate);
        /// <summary>
        /// Lấy tất cả danh sách BPFCSchedule
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> GetAllBPFCStatus();
        /// <summary>
        /// Lấy tất cả danh sách BPFCSchedule
        /// </summary>
        /// <returns></returns>
        Task<List<BPFCStatusDto>> GetAllBPFCEstablish();

        /// <summary>
        /// Lấy tất cả danh sách BPFCSchedule
        /// </summary>
        ///  <param name="buildingID">ID của tòa nhà</param>
        /// <returns></returns>
        Task<object> GetAllBPFCByBuildingID(int buildingID);
        Task<List<string>> GetGlueByBPFCID(int bpfcID);
        Task<BPFCEstablishDto> GetBPFCID(GetBPFCIDDto bpfcInfo);

        /// <summary>
        /// Cập nhật season cho BPFC
        /// </summary>
        /// <returns></returns>
        Task<bool> UpdateSeason(BPFCEstablishUpdateSeason entity);
        /// <summary>
        /// Cập nhật DueDate cho BPFC
        /// </summary>
        /// <returns></returns>
        Task<bool> UpdateDueDate(BPFCEstablishUpdateDueDate entity);
    }
}
