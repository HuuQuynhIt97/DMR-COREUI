using System.Threading.Tasks;
using DMR_API._Repositories.Interface;
using DMR_API.Data;
using DMR_API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using DMR_API.DTO;
using System.Collections.Generic;
using System.Transactions;
using System;

namespace DMR_API._Repositories.Repositories
{
    public class GlueIngredientRepository : ECRepository<GlueIngredient>, IGlueIngredientRepository
    {
        private readonly DataContext _context;
        public GlueIngredientRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<bool> EditPercentage(int glueid, int ingredientid, int percentage)
        {
            if (await _context.GlueIngredient.AnyAsync(x => x.GlueID == glueid && x.IngredientID == ingredientid))
            {
                var item = await _context.GlueIngredient.FirstOrDefaultAsync(x => x.GlueID == glueid && x.IngredientID == ingredientid);
                item.Percentage = percentage;
                try
                {
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (System.Exception)
                {
                    return false;
                }

            }
            return false;
        }

        public async Task<bool> EditAllow(int glueid, int ingredientid, int allow)
        {
            if (await _context.GlueIngredient.AnyAsync(x => x.GlueID == glueid && x.IngredientID == ingredientid))
            {
                var item = await _context.GlueIngredient.FirstOrDefaultAsync(x => x.GlueID == glueid && x.IngredientID == ingredientid);
                item.Allow = allow;
                try
                {
                    await _context.SaveChangesAsync();
                    return true;
                }
                catch (System.Exception)
                {
                    return false;
                }

            }
            return false;
        }

        public async Task<object> GetIngredientOfGlue(int glueid)
        {
            var model = await  _context.GlueIngredient.Where(a => a.GlueID == glueid)
            .Include(a => a.Glue)
            .Include(a => a.Ingredient).Select(a => new GlueIngredientDto
                                {
                                    ID = a.GlueID,
                                    Name = a.Glue != null ? a.Glue.Name : "",
                                    Code = a.Glue != null ? a.Glue.Code : "",
                                    Ingredient = a.Ingredient,
                                    Percentage = a.Percentage
                                }).ToListAsync();

            return model;
        }

        public Task<Glue> Guidance(List<GlueIngredientForGuidanceDto> glueIngredientForGuidanceDto)
        {
            throw new NotImplementedException();
        }



        //Login khi them repo
    }
}