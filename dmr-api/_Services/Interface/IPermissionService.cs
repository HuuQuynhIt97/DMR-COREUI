using CodeUtility.TreeExtension.Model;
using DMR_API.DTO;
using DMR_API.Helpers;
using DMR_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Action = DMR_API.Models.Action;

namespace DMR_API._Services.Interface
{
   public interface IPermissionService : IECService<Permission>
    {
        Task<List<FunctionSystem>> GetAllFunction();
        Task<IEnumerable<HierarchyNode<FunctionTreeDto>>> GetFunctionsAsTreeView();
        Task<object> GetModulesAsTreeView();
        Task<List<Module>> GetAllModule();

        Task<List<Action>> GetAllAction();

        Task<ResponseDetail<object>> GetAllFunctionByPermision();
        Task<ResponseDetail<object>> UpdateModule(ModuleDto module);
        Task<ResponseDetail<object>> DeleteModule(int moduleID);
        Task<ResponseDetail<object>> AddModule(ModuleDto module);

        Task<ResponseDetail<object>> UpdateFunction(FunctionDto module);
        Task<ResponseDetail<object>> DeleteFunction(int functionID);
        Task<ResponseDetail<object>> AddFunction(FunctionDto module);

        Task<ResponseDetail<object>> UpdateAction(Action module);
        Task<ResponseDetail<object>> DeleteAction(int actionID);
        Task<ResponseDetail<object>> AddAction(Action module);
        Task<ResponseDetail<object>> PutPermissionByRoleId(int roleID, UpdatePermissionRequest request);
        Task<ResponseDetail<object>> PostActionToFunction(int functionID, ActionAssignRequest request);
        Task<ResponseDetail<object>> DeleteActionToFunction(int functionID, ActionAssignRequest request);
        Task<object> GetMenuByUserPermission(int userId);
        Task<object> GetMenuByLangID(int userId, string langID);
        Task<object> GetScreenAction(int functionID);
        Task<object> GetActionInFunctionByRoleID(int roleID);
        Task<object> GetScreenFunctionAndAction(ScreenFunctionAndActionRequest request);
        Task<List<Language>> GetAllLanguage();
        Task<ResponseDetail<object>> DeleteFunctionTranslation(int functionTranslationID);
        Task<ResponseDetail<object>> DeleteModuleTranslation(int moduleTranslationID);

    }
}
