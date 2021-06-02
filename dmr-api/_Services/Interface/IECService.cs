using System.Collections.Generic;
using System.Threading.Tasks;
using DMR_API.Helpers;

namespace DMR_API._Services.Interface
{
    public interface IECService<T> where T : class
    {
        /// <summary>
        /// Tạo mới dữ liệu
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> Add(T model);
        /// <summary>
        /// Cập nhật dữ liệu
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> Update(T model);

        /// <summary>
        /// Xóa dữ liệu
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> Delete(object id);

        /// <summary>
        /// Lấy tất cả dữ liệu
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<List<T>> GetAllAsync();

        /// <summary>
        /// Lấy tất cả dữ liệu có phân trang
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<PagedList<T>> GetWithPaginations(PaginationParams param);

        /// <summary>
        /// Lấy tất cả dữ liệu có phân trang và tìm kiếm
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<PagedList<T>> Search(PaginationParams param, object text);

        /// <summary>
        /// Lấy 1 dòng dữ liệu theo ID
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        T GetById(object id);
    }
}