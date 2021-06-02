using DMR_API.DTO;
using DMR_API.Helpers.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API._Services.Interface
{
    public interface IModelNameService: IECService<ModelNameDto>
    {
       
        Task<object> CloneModelName(CloneDto clone);
        Task<object> CloneModelNameForBPFCShcedule(CloneDto clone);
        Task<object> CloneBPFC(CloneDto clone);
        Task<List<ModelNameDto>> GetAllAsyncForAdmin();
        Task SendMailForPIC(string email);
    }
}
