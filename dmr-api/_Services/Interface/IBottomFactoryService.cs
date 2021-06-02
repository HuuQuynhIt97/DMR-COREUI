using DMR_API.DTO;
using DMR_API.Helpers;
using DMR_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API._Services.Interface
{
    public interface IBottomFactoryService
    {
        /// <summary>
        /// Lấy danh sách nhiệm vụ theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ theo tòa nhà</returns>
        Task<ToDoListForReturnDto> ToDoList(int buildingID);

        /// <summary>
        /// Lấy danh sách nhiệm vụ đã xong theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ đã xong theo tòa nhà</returns>
        Task<ToDoListForReturnDto> DoneList(int buildingID);

        /// <summary>
        /// Lấy danh sách nhiệm vụ chưa xong theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ chưa xong theo tòa nhà</returns>
        Task<ToDoListForReturnDto> UndoneList(int buildingID);

        /// <summary>
        /// Lấy danh sách nhiệm vụ đã xong theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ đã xong theo tòa nhà</returns>
        Task<DispatchListForReturnDto> DispatchList(int buildingID);

        /// <summary>
        /// Lấy danh sách nhiệm vụ bị trễ theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ bị trễ theo tòa nhà</returns>
        Task<ToDoListForReturnDto> DelayList(int buildingID);

        /// <summary>
        /// Lấy danh sách nhiệm vụ EVA_UV theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách nhiệm vụ EVA_UV theo tòa nhà</returns>
        Task<ToDoListForReturnDto> EVA_UVList(int buildingID);

        /// <summary>
        /// Bước 1: Kiểm tra hóa chất có tồn tại trong hệ thống? Nếu không tồn tại thì trả về lỗi
        /// Bước 2: Tạo mới mixingInfo và mixingInfoDetail 
        /// Bước 3: Cập nhật mixingInfo vào bảng todolist theo BuildingID, GlueNameID, EstimatedStartTime, EstimatedFinishTime
        /// </summary>
        /// <param name="printParams"></param>
        /// <returns></returns>
        Task<ResponseDetail<BottomFactoryForReturnDto>> ScanQRCode(ScanQRCodeParams printParams);

        /// <summary>
        /// Bước 1: Kiểm tra hóa chất có tồn tại trong hệ thống? Nếu không tồn tại -> trả về lỗi
        /// Bước 2: So sánh partNo nếu không giống nhau -> Trả về lỗi
        /// </summary>
        /// <param name="printParams"></param>
        /// <returns>Trả về hóa chất, code, batch</returns>
        Task<ResponseDetail<BottomFactoryForReturnDto>> ScanQRCodeV110(ScanQRCodeParams printParams);

        /// <summary>
        /// Tạo subpackage
        /// Bước 1: Lấy cài đặt trong bảng SubpackageCapacity (Đây là khối lương của mỗi can tính bằng kg)
        /// Bước 2: User nhập bao nhiên can thì tạo bấy nhiêu
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        Task<ResponseDetail<List<SubpackageDto>>> GenerateScanByNumber(GenerateSubpackageParams obj);


        Task<ResponseDetail<object>> AddDispatch(AddDispatchParams bfparams);

        Task<ResponseDetail<object>> UpdateDispatch(UpdateDispatchParams update);
        Task<BottomFactoryForDispatchDto> GetAllDispatch(DispatchParamsDto obj);

        Task<MixingInfo> GetMixingInfo(int mixingInfoID);
        Task<SubpackageCapacity> GetSubpackageCapacity();
        Task<Subpackage> GetSubpackageLatestSequence(string batch, int glueNameID, int buildingID);

        Task<bool> SaveSubpackage(SubpackageParam obj );
        /// <summary>
        /// Tạo danh sách việc làm cho xưởng đế (STF)
        /// </summary>
        /// <param name="plans">Danh sách ID kế hoạch làm việc.</param>
        /// <returns>Trả về 1 object chứa status và message</returns>
        Task<object> GenerateToDoList(List<int> plans);
        /// <summary>
        /// Cập nhật thời gian in keo theo danh sách subpackagesID
        /// </summary>
        /// <param name="subpackages"></param>
        /// <returns></returns>
        Task<bool> Print(List<int> subpackages);

    }
}
