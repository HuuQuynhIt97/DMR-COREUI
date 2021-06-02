using System.Reflection;
using DMR_API._Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Module = DMR_API.Models.Module;
using DMR_API.Models;
using Action = DMR_API.Models.Action;
using DMR_API.DTO;

namespace DMR_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        #region Ctor
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        } 
        #endregion

        #region Module

        [HttpGet("GetAllModule")]
        public async Task<IActionResult> GetAllModule()
        {
            var result = await _permissionService.GetAllModule();
            return Ok(result);
        }
        [HttpGet("GetModulesAsTreeView")]
        public async Task<IActionResult> GetModulesAsTreeView()
        {
            var result = await _permissionService.GetModulesAsTreeView();
            return Ok(result);
        }

        [HttpPost("CreateModule")]
        public async Task<IActionResult> CreateModule(ModuleDto create)
        {

            var result = await _permissionService.AddModule(create);
            if (result.Status)
            {
                return NoContent();
            }

            throw new Exception("Creating the Module failed on save");
        }

        [HttpPut("UpdateModule")]
        public async Task<IActionResult> UpdateModule(ModuleDto update)
        {
            var result = await _permissionService.UpdateModule(update);
            if (result.Status)
                return NoContent();
            return BadRequest($"Updating Module {update.ID} failed on save");
        }
        [HttpDelete("DeleteModule/{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            var result = await _permissionService.DeleteModule(id);
            if (result.Status)
                return NoContent();
            throw new Exception("Error deleting the Module");
        }

        [HttpDelete("DeleteModuleTranslation/{id}")]
        public async Task<IActionResult> DeleteModuleTranslation(int id)
        {
            var result = await _permissionService.DeleteModuleTranslation(id);
            if (result.Status)
                return NoContent();
            throw new Exception("Error deleting the Module Translation");
        }
        #endregion

        #region Function

        [HttpGet("GetAllFunction")]
        public async Task<IActionResult> GetAllFunction()
        {
            var result = await _permissionService.GetAllFunction();
            return Ok(result);
        }
        [HttpGet("GetFunctionsAsTreeView")]
        public async Task<IActionResult> GetFunctionsAsTreeView()
        {
            var result = await _permissionService.GetFunctionsAsTreeView();
            return Ok(result);
        }
        [HttpPost("CreateFunction")]
        public async Task<IActionResult> CreateFunction(FunctionDto create)
        {
            var result = await _permissionService.AddFunction(create);
            if (result.Status)
            {
                return NoContent();
            }

            throw new Exception("Creating the Function failed on save");
        }
        [HttpPut("UpdateFunction")]
        public async Task<IActionResult> UpdateFunction(FunctionDto update)
        {
            var result = await _permissionService.UpdateFunction(update);
            if (result.Status)
                return NoContent();
            return BadRequest($"Updating Function {update.ID} failed on save");
        }

        [HttpDelete("DeleteFunction/{id}")]
        public async Task<IActionResult> DeleteFunction(int id)
        {
            var result = await _permissionService.DeleteFunction(id);
            if (result.Status)
                return NoContent();
            throw new Exception("Error deleting the Function");
        }
        [HttpDelete("DeleteFunctionTranslation/{id}")]
        public async Task<IActionResult> DeleteFunctionTranslation(int id)
        {
            var result = await _permissionService.DeleteFunctionTranslation(id);
            if (result.Status)
                return NoContent();
            throw new Exception("Error deleting the Function Translation");
        }

        #endregion

        #region Action
        [HttpGet("GetAllAction")]
        public async Task<IActionResult> GetAllAction()
        {
            var result = await _permissionService.GetAllAction();
            return Ok(result);
        }

        [HttpPost("CreateAction")]
        public async Task<IActionResult> CreateAction(Action create)
        {
            var result = await _permissionService.AddAction(create);
            if (result.Status)
            {
                return NoContent();
            }

            throw new Exception("Creating the Action failed on save");
        }

        [HttpPut("UpdateAction")]
        public async Task<IActionResult> UpdateAction(Action update)
        {
            var result = await _permissionService.UpdateAction(update);
            if (result.Status)
                return NoContent();
            return BadRequest($"Updating Action {update.ID} failed on save");
        }

        [HttpDelete("DeleteAction/{id}")]
        public async Task<IActionResult> DeleteAction(int id)
        {
            var result = await _permissionService.DeleteAction(id);
            if (result.Status)
                return NoContent();
            throw new Exception("Error deleting the Action");
        }


        #endregion

        #region ActionInFunction

        [HttpPost("PostActionToFunction/{functionID}")]
        public async Task<IActionResult> PostActionToFunction(int functionID, ActionAssignRequest request)
        {
            //create new permission list from user changed

            var result = await _permissionService.PostActionToFunction(functionID, request);
            if (result.Status)
            {
                return NoContent();
            }
            return BadRequest("Save ActionInFunction failed");
        }

        [HttpDelete("DeleteActionToFunction/{functionID}")]
        public async Task<IActionResult> DeleteActionToFunction(int functionID, [FromQuery] ActionAssignRequest request)
        {
            //create new permission list from user changed

            var result = await _permissionService.DeleteActionToFunction(functionID, request);
            if (result.Status)
            {
                return NoContent();
            }
            return BadRequest("Save ActionInFunction failed");
        }
        #endregion

        #region Permission

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _permissionService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("GetMenuByLangID")]
        public async Task<IActionResult> GetMenuByLangID([FromQuery] int userID, [FromQuery] string langID)
        {
            //create new permission list from user changed

            var result = await _permissionService.GetMenuByLangID(userID, langID);
            return Ok(result);
        }
        [HttpPost("GetScreenFunctionAndAction")]
        public async Task<IActionResult> GetScreenFunctionAndAction(ScreenFunctionAndActionRequest request)
        {
            //create new permission list from user changed

            var result = await _permissionService.GetScreenFunctionAndAction(request);
            return Ok(result);
        }
        [HttpGet("GetActionInFunctionByRoleID/{roleID}")]
        public async Task<IActionResult> GetActionInFunctionByRoleID(int roleID)
        {
            var result = await _permissionService.GetActionInFunctionByRoleID(roleID);
            return Ok(result);
        }
        [HttpGet("GetMenuByUserPermission/{userId}")]
        public async Task<IActionResult> GetMenuByUserPermission(int userId)
        {
            var result = await _permissionService.GetMenuByUserPermission(userId);
            return Ok(result);
        }



        [HttpPut("PutPermissionByRoleId/{roleId}")]
        public async Task<IActionResult> PutPermissionByRoleId(int roleId, [FromBody] UpdatePermissionRequest request)
        {
            //create new permission list from user changed

            var result = await _permissionService.PutPermissionByRoleId(roleId, request);
            if (result.Status)
            {
                return NoContent();
            }
            return BadRequest("Save permission failed");
        }

        [HttpGet("GetScreenAction/{functionID}")]
        public async Task<IActionResult> GetScreenAction(int functionID)
        {
            //create new permission list from user changed

            var result = await _permissionService.GetScreenAction(functionID);
            return Ok(result);
        }

        #endregion

        #region Language
        [HttpGet("GetAllLanguage")]
        public async Task<IActionResult> GetAllLanguage()
        {
            //create new permission list from user changed

            var result = await _permissionService.GetAllLanguage();
            return Ok(result);
        }
        #endregion
    }
}

