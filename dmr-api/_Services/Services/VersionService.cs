using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DMR_API.Helpers;
using AutoMapper;
using DMR_API._Repositories.Interface;
using DMR_API._Services.Interface;
using Microsoft.EntityFrameworkCore;
using Version = DMR_API.Models.Version;

namespace DMR_API._Services.Services
{
    public class VersionService : IVersionService
    {

        private readonly IVersionRepository _repoVersion;
        public VersionService(
            IVersionRepository repoVersion)
        {
            _repoVersion = repoVersion;
        }

        public async Task<bool> Add(Version model)
        {
            model.CreatedTime  = DateTime.Now;
            _repoVersion.Add(model);
            return await _repoVersion.SaveAll();
        }

        public async Task<PagedList<Version>> GetWithPaginations(PaginationParams param)
        {
            var lists = _repoVersion.FindAll().OrderByDescending(x => x.ID);
            return await PagedList<Version>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        public async Task<PagedList<Version>> Search(PaginationParams param, object text)
        {
            var lists = _repoVersion.FindAll()
            .Where(x => x.Name.Contains(text.ToString()))
            .OrderByDescending(x => x.ID);
            return await PagedList<Version>.CreateAsync(lists, param.PageNumber, param.PageSize);
        }
        public async Task<bool> Delete(object id)
        {
            var Version = _repoVersion.FindById(id);
            _repoVersion.Remove(Version);
            return await _repoVersion.SaveAll();
        }

        public async Task<bool> Update(Version model)
        {
            model.UpatedTime = DateTime.Now;
            _repoVersion.Update(model);
            return await _repoVersion.SaveAll();
        }

        public async Task<List<Version>> GetAllAsync() => await _repoVersion.FindAll().OrderByDescending(x => x.ID).ToListAsync();

        public Version GetById(object id) => _repoVersion.FindById(id);

    }
}