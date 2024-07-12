using System;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Repositories
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly DatnTrung62132908Context _context;
       
        public ProductTypeRepository(DatnTrung62132908Context context)
        {
            _context = context;         
        }

        public async Task Create(ProductTypeModel productType)
        {
            try
            {
                var newProductType = new ProductType
                {
                    ProductTypeName = productType.ProductTypeName,
                    Description = productType.Description,
                    CreateAt = DateTime.Now,
                    //CreatedBy = productType.CreatedBy,
                };
                _context.ProductTypes.Add(newProductType);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating product type.", ex);
            }
        }

        public async Task<ProductType> GetById(int id)
        {
            var productType = await _context.ProductTypes.FindAsync(id);
            if (productType == null)
            {
                return null; // Return null if not found
            }

            return new ProductType
            {
                ProductTypeId = productType.ProductTypeId,
                ProductTypeName = productType.ProductTypeName,
                Description = productType.Description,
                CreateAt = productType.CreateAt,
                //CreatedBy = productType.CreatedBy,
                UpdateAt = productType.UpdateAt,
                UpdateBy = productType.UpdateBy,
            };
        }

        public async Task Update(ProductTypeModel1 productType)
        {
            var existingProductType = await _context.ProductTypes.FindAsync(productType.ProductTypeId);
            if (existingProductType != null)
            {
                existingProductType.ProductTypeName = productType.ProductTypeName;
                existingProductType.Description = productType.Description;
                existingProductType.UpdateAt = DateTime.Now; ;
                existingProductType.UpdateBy = productType.UpdateBy;

                _context.Entry(existingProductType).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }
        public async Task Delete(int id)
        {
            var productType = await _context.ProductTypes.FindAsync(id);
            if (productType != null)
            {
                _context.ProductTypes.Remove(productType);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<ProductType>> GetAll()
        {
            var productTypes = await _context.ProductTypes.ToListAsync();
            return productTypes.Select(productType => new ProductType
            {
                ProductTypeId = productType.ProductTypeId,
                ProductTypeName = productType.ProductTypeName,
                Description = productType.Description,
                CreateAt = productType.CreateAt,
                //CreatedBy = productType.CreatedBy,
                UpdateAt = productType.UpdateAt,
                UpdateBy = productType.UpdateBy,

            }).ToList();
        }
    }
}
