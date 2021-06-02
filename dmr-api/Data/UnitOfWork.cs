using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DMR_API.Data
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync();
        IDbContextTransaction BeginTransaction();
        Task<IDbContextTransaction> BeginTransactionAsync();
    }
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private DataContext _context;

        public UnitOfWork(DataContext dbFactory)
        {
            _context = dbFactory;
        }
        public void Dispose()
        {
            _context?.Dispose();
        }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
        public IDbContextTransaction BeginTransaction()
        {
            return _context.Database.BeginTransaction();
        }
        public Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return  _context.Database.BeginTransactionAsync();
        }
    }

}
