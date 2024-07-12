using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Repositories
{
    public class DiscountRepository : IDiscountRepository
    {
        private readonly DatnTrung62132908Context _context;

        public DiscountRepository(DatnTrung62132908Context context)
        {
            _context = context;
        }

        public async Task Create(DiscountModel discountModel)
        {
            try
            {
                var newDiscount = new Discount
                {
                    DiscountValue = discountModel.DiscountValue,
                    CreateAt = DateTime.Now,
                    //CreatedBy = discountModel.CreatedBy,
                };
                _context.Discounts.Add(newDiscount);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating discount.", ex);
            }
        }

        public async Task<Discount> GetById(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
            {
                return null;
            }

            return new Discount
            {
                DiscountId = discount.DiscountId,
                DiscountValue = discount.DiscountValue,
                CreateAt = discount.CreateAt,
                //CreatedBy = discount.CreatedBy,
                UpdateAt = discount.UpdateAt,
                //UpdateBy = discount.UpdateBy,
            };
        }

        public async Task Update(DiscountModel1 discountModel)
        {
            var existingDiscount = await _context.Discounts.FindAsync(discountModel.DiscountId);
            if (existingDiscount != null)
            {
                existingDiscount.DiscountValue = discountModel.DiscountValue;
                existingDiscount.UpdateAt = DateTime.Now;
                //existingDiscount.UpdateBy = discountModel.UpdateBy;

                _context.Entry(existingDiscount).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount != null)
            {
                _context.Discounts.Remove(discount);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Discount>> GetAll()
        {
            var discounts = await _context.Discounts.ToListAsync();
            return discounts.Select(discount => new Discount
            {
                DiscountId = discount.DiscountId,
                DiscountValue = discount.DiscountValue,
                CreateAt = discount.CreateAt,
                //CreatedBy = discount.CreatedBy,
                UpdateAt = discount.UpdateAt,
                //UpdateBy = discount.UpdateBy,
            }).ToList();
        }
    }
}
