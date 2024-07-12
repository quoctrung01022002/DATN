using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Repositories
{
    public class BrandRepository : IBrandRepository
    {
        private readonly DatnTrung62132908Context _context;

        public BrandRepository(DatnTrung62132908Context context)
        {
            _context = context;
        }

        public async Task<int> CreateBrand(BrandModel brandModel)
        {
            try
            {
                var newBrand = new Brand
                {
                    CountryOfOrigin = brandModel.CountryOfOrigin,
                    CreateAt = DateTime.Now,
                    //CreatedBy = brandModel.CreatedBy,
                };
                _context.Brands.Add(newBrand);
                await _context.SaveChangesAsync();
                return newBrand.BrandId;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating brand.", ex);
            }
        }

        public async Task<Brand> GetBrandById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
            {
                return null;
            }

            return new Brand
            {
                BrandId = brand.BrandId,
                CountryOfOrigin = brand.CountryOfOrigin,
                CreateAt = brand.CreateAt,
                //CreatedBy = brand.CreatedBy,
                UpdateAt = brand.UpdateAt,
                //UpdateBy = brand.UpdateBy,
                Products = brand.Products,
            };
        }

        public async Task UpdateBrand(BrandModel1 brandModel)
        {
            var existingBrand = await _context.Brands.FindAsync(brandModel.BrandId);
            if (existingBrand != null)
            {
                existingBrand.CountryOfOrigin = brandModel.CountryOfOrigin;
                existingBrand.UpdateAt = DateTime.Now;
                //existingBrand.UpdateBy = brandModel.UpdateBy;

                _context.Entry(existingBrand).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand != null)
            {
                _context.Brands.Remove(brand);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Brand>> GetAllBrands()
        {
            var brands = await _context.Brands.ToListAsync();
            return brands.Select(brand => new Brand
            {
                BrandId = brand.BrandId,
                CountryOfOrigin = brand.CountryOfOrigin,
                CreateAt = brand.CreateAt,
                //CreatedBy = brand.CreatedBy,
                UpdateAt = brand.UpdateAt,
                //UpdateBy = brand.UpdateBy,
                Products = brand.Products,
            });
        }

    }
}
