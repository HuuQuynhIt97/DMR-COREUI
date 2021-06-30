using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DMR_API.Helpers;
using DMR_API._Services.Interface;
using DMR_API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using System.IO;
using DMR_API.Helpers.Enum;

namespace DMR_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ModelNameController : ControllerBase
    {
        private readonly IModelNameService _modelNameService;
        private readonly IMailExtension _mailExtension;

        public ModelNameController(IModelNameService modelNameService, IMailExtension mailExtension)
        {
            _modelNameService = modelNameService;
            _mailExtension = mailExtension;
        }
        // new version
        [HttpPost]
        public async Task<IActionResult> CloneBPFC(CloneDto clone)
        {
            return Ok(await _modelNameService.CloneBPFC(clone));
        }
        // clone
        [HttpPost]
        public async Task<IActionResult> Clone(CloneDto clone)
        {
            return Ok(await _modelNameService.CloneModelName(clone));
        }

        // update by Huu Quynh 05/14/2021
        [HttpPost]
        public async Task<IActionResult> CloneModelNameForBPFCShcedule(CloneDto clone)
        {
            return Ok(await _modelNameService.CloneModelNameForBPFCShcedule(clone));
        }

        [HttpGet]
        public async Task<IActionResult> GetModelNames([FromQuery] PaginationParams param)
        {
            var modelNames = await _modelNameService.GetWithPaginations(param);
            Response.AddPagination(modelNames.CurrentPage, modelNames.PageSize, modelNames.TotalCount, modelNames.TotalPages);
            return Ok(modelNames);
        }

        [HttpGet(Name = "GetModelNames")]
        public async Task<IActionResult> GetAll()
        {
            var modelNames = await _modelNameService.GetAllAsync();
            return Ok(modelNames);
        }
        [HttpGet("{ID}")]
        public IActionResult GetModelNameByID(int ID)
        {
            var modelNames = _modelNameService.GetById(ID);
            return Ok(modelNames);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var modelNames = await _modelNameService.GetAllAsyncForAdmin();
            return Ok(modelNames);
        }
      
        [HttpGet("{text}")]
        public async Task<IActionResult> Search([FromQuery] PaginationParams param, string text)
        {
            var lists = await _modelNameService.Search(param, text);
            Response.AddPagination(lists.CurrentPage, lists.PageSize, lists.TotalCount, lists.TotalPages);
            return Ok(lists);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ModelNameDto create)
        {

            if (_modelNameService.GetById(create.ID) != null)
                return BadRequest("ModelName ID already exists!");
            if (await _modelNameService.Add(create))
            {
                return NoContent();
            }

            throw new Exception("Creating the model name failed on save");
        }
        [HttpGet("{email}")]
        public async Task<IActionResult> SendMailForPIC(string email)
        {
            await _modelNameService.SendMailForPIC(email);
            return NoContent();
        }
        [HttpPut]
        public async Task<IActionResult> Update(ModelNameDto update)
        {
            if (await _modelNameService.Update(update))
                return NoContent();
            return BadRequest($"Updating model name {update.ID} failed on save");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (await _modelNameService.Delete(id))
                return NoContent();
            throw new Exception("Error deleting the model name");
        }
      
        [HttpGet]
        public async Task<IActionResult> ExcelExport()
        {
            string filename = "BPFCTemplate.xlsx";
            if (filename == null)
                return Content("filename not present");

            var path = Path.Combine(
                           Directory.GetCurrentDirectory(),
                           "wwwroot/excelTemplate", filename);

            var memory = new MemoryStream();
            using (var stream = new FileStream(path, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(path), Path.GetFileName(path));
        }
        private string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/octet-stream"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".csv", "text/csv"}
            };
        }
    }
}