using DMR_API.DTO;
using DMR_API.Helpers;
using DMR_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API._Services.Interface
{
    public interface IToDoListService
    {
        /// <summary>
        /// Lấy tẩ cả các nhiệm vụ đã hoàn thành
        /// </summary>
        /// <param name="buildingID"></param>
        /// <returns>Danh sách nhiệm vụ, tổng xong, tổng chưa xong, tổng trì hoãn, tổng giao</returns>
        Task<ToDoListForReturnDto> Done(int buildingID);
        /// <summary>
        /// Kiểm tra đang thêm kế hoạch làm việc cho xưởng đế (STF) hay là thành hình (ASY)
        /// </summary>
        /// <param name="plans">Dach dánh ID kế hoạch làm việc.</param>
        /// <returns>True là xưởng đế (STF), ngược lại thành hình (ASY)</returns>
        Task<bool> CheckBuildingType(List<int> plans);

        /// <summary>
        /// Lấy danh sách đã giao keo xong
        /// </summary>
        /// <param name="buildingID"></param>
        /// <returns>Danh sách đã giao keo xong</returns>
        Task<ToDoListForReturnDto> DispatchDone(int buildingID);

        /// <summary>
        /// Tạo danh sách việc làm cho thành hình (ASY)
        /// </summary>
        /// <param name="plans">Danh sách ID kế hoạch làm việc.</param>
        /// <returns>Trả về trạng thái và thông báo</returns>
        Task<object> GenerateToDoList(List<int> plans);

        /// <summary>
        /// Lấy danh sách nhiệm vụ theo tòa nhà
        ///  Thêm bởi Quỳnh (Leo 1/28/2021 11:46)
        /// </summary>
        /// <param name="buildingID"></param>
        /// <returns>Danh sách nhiệm vụ theo tòa nhà</returns>
        Task<ToDoListForReturnDto> ToDo(int buildingID);

        /// <summary>
        /// Lấy danh sách pha thêm theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>danh sách pha thêm</returns>
        Task<ToDoListForReturnDto> ToDoAddition(int buildingID);

        Task<DispatchListForReturnDto> DispatchAddition(int buildingID);
        /// <summary>
        /// Lấy danh sách giao keo theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách giao keo</returns>
        Task<DispatchListForReturnDto> DispatchList(int buildingID);

        /// <summary>
        /// Lấy danh sách giao keo bị trễ theo tòa nhà
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <returns>Danh sách giao keo bị trễ</returns>
        Task<DispatchListForReturnDto> DispatchListDelay(int buildingID);
        /// <summary>
        ///  Thêm bởi Quỳnh (Leo 1/28/2021 11:46)
        /// </summary>
        /// <param name="glueNameID"></param>
        /// <param name="glueID"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        Task<ToDoListForReturnDto> Delay(int buildingID);
        Task<bool> AddRange(List<ToDoList> toDoList);
        Task<MixingInfo> Mix(MixingInfoForCreateDto mixForToDoListDto);
        void UpdateDispatchTimeRange(ToDoListForUpdateDto model);
        void UpdateMixingTimeRange(ToDoListForUpdateDto model);
        void UpdateStiringTimeRange(ToDoListForUpdateDto model);

        /// <summary>
        /// Xuất những việc làm hoàn thành và bị trễ trong ngày hiện tại
        /// </summary>
        /// <param name="buildingID"></param>
        /// <returns>File</returns>
        Task<Byte[]> ExportExcelToDoListByBuilding(int buildingID);

        /// <summary>
        /// Xuất những việc làm hoàn thành trong ngày hiện tại
        /// </summary>
        /// <param name="buildingID"></param>
        /// <returns>File</returns>
        Task<Byte[]> ExportExcelNewReportOfDonelistByBuilding(int buildingID);
        /// <summary>
        /// Xuất những việc làm hoàn thành trong ngày hiện tại cho tất cả tòa nhà
        /// </summary>
        /// <returns>File</returns>
        Task<Byte[]> ExportExcelToDoListWholeBuilding();

        /// <summary>
        /// Xuất những việc làm hoàn thành theo khoảng thời gian cho tất cả tòa nhà
        /// </summary>
        /// <returns>File</returns>
        Task<Byte[]> ExportExcelToDoListWholeBuilding(DateTime startTime, DateTime endTime);

        /// <summary>
        /// Khi chọn in keo ->  cập nhật thời gian in keo theo mixingInfoID
        /// </summary>
        /// <param name="mixingInfoID">ID của keo đã được trộn</param>
        /// <returns>Đối tượng keo đã được trộn</returns>
        MixingInfo PrintGlue(int mixingInfoID);
        /// <summary>
        /// Tìm kiếm keo
        /// </summary>
        /// <param name="mixingInfoID"></param>
        /// <returns></returns>
        MixingInfo FindPrintGlue(int mixingInfoID);

        /// <summary>
        /// Khi chọn in keo ->  cập nhật thời gian in keo theo mixingInfoID
        /// Và cập nhật thời gian in keo theo mixingInfoID vào bảng dispatchList
        /// </summary>
        /// <param name="mixingInfoID">ID của keo đã được trộn</param>
        /// <param name="dispatchListID">ID của giao keo</param>
        /// <returns>Đối tượng keo đã được trộn</returns>
        MixingInfo PrintGlueDispatchList(int mixingInfoID, int dispatchListID);

        /// <summary>
        ///  Khi chọn in keo ->  cập nhật thời gian in keo theo mixingInfoID
        /// </summary>
        /// <param name="mixingInfoID"></param>
        /// <param name="glueNameID"></param>
        /// <param name="estimatedStartTime"></param>
        /// <param name="estimatedFinsihTime"></param>
        /// <returns></returns>
        Task<MixingInfo> PrintGlueDispatchListAsync(int mixingInfoID, int glueNameID, DateTime estimatedStartTime, DateTime estimatedFinsihTime);

        /// <summary>
        /// Cập nhật mixingInfoID vào bảng dispathList dựa theo các khóa chính là (glueNameID,estimatedStartTime, estimatedFinsihTime )
        /// </summary>
        /// <param name="mixingInfoID"></param>
        /// <param name="glueNameID"></param>
        /// <param name="estimatedStartTime"></param>
        /// <param name="estimatedFinsihTime"></param>
        /// <returns></returns>
        Task<ResponseDetail<string>> UpdateMixingInfoDispatchList(int mixingInfoID, int glueNameID, DateTime estimatedStartTime, DateTime estimatedFinsihTime);
        /// <summary>
        /// Cập nhật FinishDispatchingTime vào bảng dispathList dựa theo các khóa là (Danh sách line, glueNameID,estimatedStartTime, estimatedFinsihTime )
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        Task<ResponseDetail<string>> FinishDispatch(FinishDispatchParams obj);


        Task<ResponseDetail<string>> UpdateDispatchDetail(DispatchDetailForUpdateDto dispatchDto);

        Task<List<DispatchDetailDto>> GetDispatchDetail(int buildingID, int glueNameID, DateTime estimatedStartTime, DateTime estimatedFinsihTime);
        Task<object> Dispatch(DispatchParams todolistDto);
        Task<bool> Cancel(ToDoListForCancelDto todolistID);
        Task<bool> CancelRange(List<ToDoListForCancelDto> todolistIDList);
        Task<bool> SendMail(Byte[] data, DateTime time);
        bool UpdateStartStirTimeByMixingInfoID(int mixingInfoID);
        bool UpdateFinishStirTimeByMixingInfoID(int mixingInfoID);
        MixingDetailForResponse GetMixingDetail(MixingDetailParams obj);

        /// <summary>
        /// Tạo ra danh sách dispatch theo plan
        /// </summary>
        /// <param name="plans"></param>
        /// <returns></returns>
        Task<object> GenerateDispatchList(List<int> plans);

        /// <summary>
        ///  Thêm bởi Quỳnh (Leo 1/28/2021 11:46)
        /// </summary>
        /// <param name="glueNameID"></param>
        /// <param name="glueID"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <returns></returns>
        /// 
        Task<object> Addition(int glueNameID, int glueID, DateTime start, DateTime end);
        Task<ResponseDetail<object>> AdditionDispatch(int glueNameID);
        //Thêm bởi Quỳnh (Leo 2/2/2021 11:46)
        Task<object> MixedHistory(int MixingInfoID);
        //Thêm bởi Quỳnh (Leo 2/2/2021 11:46)

        Task<List<DispatchListDto>> GetDispatchListDetail(int glueNameID, string estimatedStartTime, string estimatedFinishTime);
        Task<ResponseDetail<object>> UpdateDispatchDetail(DispatchListForUpdateDto update);
        Task<List<MixingInfo>> GetMixingInfoHistory(int buildingID, int glueNameID, string estimatedStartTime, string estimatedFinishTime);
        /// <summary>
        /// Thêm giờ tăng ca
        /// </summary>
        /// <param name="plans">Danh sách ID kế hoạch làm việc</param>
        /// <returns>Trả về trạng thái và thông báo</returns>
        Task<object> AddOvertime(List<int> plans);
        /// <summary>
        /// Hủy giờ tăng ca
        /// </summary>
        /// <param name="plans">Danh sách ID kế hoạch làm việc</param>
        /// <returns>Trả về trạng thái và thông báo</returns>
        Task<object> RemoveOvertime(List<int> plans);

    }
}
