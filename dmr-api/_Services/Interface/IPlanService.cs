using DMR_API.DTO;
using DMR_API.Models;
using DMR_API.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMR_API.Helpers;

namespace DMR_API._Services.Interface
{
    public interface IPlanService : IECService<PlanDto>
    {
        /// <summary>
        /// Lấy danh sách các kế hoạch làm việc của ngày mai mà đã được tạo và dc nhấn nút cập nhật trong ngày hôm nay của 1 tòa nhà
        /// Tính tỉ lệ thành tích của từng chuyền theo công tức: 
        /// Danh sách các kế hoạch làm việc của ngày mai mà đã được tạo và dc nhấn nút cập nhật trong ngày hôm nay của 1 tòa nhà / Tổng số chuyền của 1 tòa nhà
        /// Tính tỉ lệ thành tích của toàn bộ nhà máy theo công thức:
        /// Cộng danh sách các kế hoạch làm việc của ngày mai mà đã được tạo và dc nhấn nút cập nhật trong ngày hôm nay của các chuyền / Tổng toàn bộ số chuyền
        /// </summary>
        /// <returns></returns>
        Task<ResponseDetail<Byte[]>> AchievementRateExcelExport();

        /// <summary>
        /// Lấy tất cả kế hoạch làm việc của ngày hôm nay
        /// </summary>
        /// <returns></returns>
        Task<object> GetAllPlanByDefaultRange();

        /// <summary>
        /// Lấy tất cả kế hoạch làm việc theo khoảng thời gian và theo 1 tòa nhà 
        /// </summary>
        /// <param name="building">ID của tòa nhà</param>
        /// <param name="min">Thời gian bắt đầu</param>
        /// <param name="max">Thời gian kết thúc</param>
        /// <returns></returns>
        Task<object> GetAllPlanByRange(int building, DateTime min, DateTime max);

        /// <summary>
        /// Lấy tất cả kế hoạch làm việc theo khoảng thời gian 
        /// </summary>
        /// <param name="min">Thời gian bắt đầu</param>
        /// <param name="max">Thời gian kết thúc</param>
        /// <returns></returns>
        Task<object> GetAllPlansByDate(string from, string to);
        Task<object> Summary(int building);
        Task<object> GetLines(int buildingID);

        /// <summary>
        /// Báo cáo 
        /// </summary>
        /// <param name="startDate">Thời gian bắt đầu</param>
        /// <param name="endDate">Thời gian kết thúc</param>
        /// <returns></returns>
        Task<byte[]> Report(DateTime startDate, DateTime endDate);
        Task<byte[]> GetReportByBuilding(DateTime startDate, DateTime endDate, int building);
        Task<byte[]> GetNewReportByBuilding(DateTime startDate, DateTime endDate, int building);


        Task<byte[]> ReportConsumptionCase2(ReportParams reportParams);
        Task<byte[]> ReportConsumptionCase3(ReportParams reportParams);
        Task<byte[]> ReportConsumptionCase1(ReportParams reportParams);
        Task<List<GlueCreateDto1>> GetGlueByBuilding(int buildingID);
        Task<List<GlueCreateDto1>> GetGlueByBuildingModelName(int buildingID, int modelName);

        Task<object> GetBatchByIngredientID(int ingredientID);
        Task<List<PlanDto>> GetGlueByBuildingBPFCID(int buildingID, int bpfcID);
        Task<object> DispatchGlue(BuildingGlueForCreateDto obj);

        Task <object> TroubleShootingSearch(string ingredientName , string batch);

        /// <summary>
        /// Nhân bản kế hoạch làm việc
        /// </summary>
        /// <param name="plans"></param>
        /// <returns></returns>
        Task<object> ClonePlan(List<PlanForCloneDto> plans);

        /// <summary>
        /// Xóa nhiều kế hoạch 1 lúc
        /// </summary>
        /// <param name="plansDto"></param>
        /// <returns></returns>
        Task<object> DeleteRange(List<int> plansDto);

        /// <summary>
        /// Lấy tât cả tên keo theo BPFCID
        /// </summary>
        /// <param name="tooltip"></param>
        /// <returns></returns>
        Task<object> GetBPFCByGlue(TooltipParams tooltip);
        Task<bool> EditDelivered(int id, string qty );
        Task<bool> EditQuantity(int id, int qty );
        Task<bool> DeleteDelivered(int id);

        Task<List<ConsumtionDto>> ConsumptionByLineCase1(ReportParams reportParams);
        Task<List<ConsumtionDto>> ConsumptionByLineCase2(ReportParams reportParams);
        Task<List<ConsumtionDto>> ConsumptionByLineCase3(ReportParams reportParams);
        Task<List<TodolistDto>> CheckTodolistAllBuilding();
        Task<object> Dispatch(DispatchParams todolistDto);
        Task<MixingInfo> Print(DispatchParams todolistDto);
        MixingInfo PrintGlue(int mixingÌnoID);
        Task<object> Finish(int mixingÌnoID);
        PlanDto FindByID(int ID);
        Task<int?> FindBuildingByLine(int lineID);

        /// <summary>
        /// Xóa kế hoạch làm việc
        /// </summary>
        /// <param name="id">ID của kế hoạch làm việc</param>
        /// <returns></returns>
        Task<bool> DeletePlan(int id);
        // Lấy thời gian bắt đầu sequence = 1 trong bảng period theo lunchtime
        // sua ngay 3/15/2021 2:28pm
        //Task<ResponseDetail<Period>> GetStartTimeFromPeriod(int buildingID);
        // sua ngay 3/15/2021 2:28pm
        Task<ResponseDetail<PeriodMixing>> GetStartTimeFromPeriod(int buildingID);

        /// <summary>
        /// Kiểm tra tồn tại thời gian tạo kế hoạch làm việc. 
        /// Kiểm tra mỗi chuyền thời gian không được gối lên nhau.
        /// </summary>
        /// <param name="lineID">ID của chuyền</param>
        /// <param name="statTime">Thời gian bắt đầu</param>
        /// <param name="endTime">Thời gian kết thúc</param>
        /// <param name="dueDate">Ngày đáo hạn</param>
        /// <returns></returns>
        Task<bool> CheckExistTimeRange(int lineID, DateTime statTime, DateTime endTime, DateTime dueDate);

        /// <summary>
        /// Kiểm tra trùng lắp kế hoạch làm việc
        /// </summary>
        /// <param name="lineID">ID của chuyền</param>
        /// <param name="BPFCEstablishID"></param>
        /// <param name="dueDate">Ngày đáo hạn</param>
        /// <returns></returns>
        Task<bool> CheckDuplicate(int lineID, int BPFCEstablishID, DateTime dueDate);
        bool DeleteRangePlan(List<int> plans);

        /// <summary>
        /// Đổi kế hoạch làm việc. Lấy ID của kế hoạch làm việc
        /// </summary>
        /// <param name="planID">ID của kế hoạc cũ</param>
        /// <param name="bpfcID">BPFCID mới hoac chinh no</param>
        /// <returns></returns>
        Task<ResponseDetail<object>> ChangeBPFC(int planID, int bpfcID);// v102

        /// <summary>
        /// Mở lại chuyền
        /// </summary>
        /// <param name="planID"></param>
        /// <returns></returns>
        Task<ResponseDetail<object>> Online(int planID);// v102

        /// <summary>
        /// Ngưng chuyền
        /// </summary>
        /// <param name="planID"></param>
        /// <returns></returns>
        Task<ResponseDetail<object>> Offline(int planID);// v102

        /// <summary>
        /// Xuất báo cáo theo tòa nhà và khoảng thời gian
        /// </summary>
        /// <param name="buildingID">ID của tòa nhà</param>
        /// <param name="startDate">Thời gian bắt đầu</param>
        /// <param name="endDate">Thời gian kết thúc</param>
        /// <returns></returns>
        Task<ResponseDetail<Byte[]>> ExportExcelWorkPlanWholeBuilding(int buildingID, DateTime startDate, DateTime endDate);
        /// <summary>
        /// Excel Export
        /// </summary>
        /// <param name="plans">Danh sách plan</param>
        /// <param name="buildingID">BPFCID mới</param>
        /// <returns></returns>
        Task<ResponseDetail<Byte[]>> ExportExcel(ExcelExportDto dto);
        /// <summary>
        /// (Update on time)/12(Total)=100% Achievement Rate  => what is the standard time of "update on time" ? 
        /// </summary>
        Task<ResponseDetail<object>> AchievementRate(int building);
        Task<ResponseDetail<Byte[]>> AchievementRateExcelExport(string date);
    }
}
