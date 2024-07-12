using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Request;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd_DATN.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;

        public ProductRepository(DatnTrung62132908Context context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task Create(ProductModel2 product)
        {
            try
            {
                string fileName = null;

                if (product.ImageFile != null && product.ImageFile.Length > 0)
                {
                    // Get file name
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.ImageFile.FileName);
                    // File path to store the image in wwwroot/uploads
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Store file in wwwroot/uploads directory
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await product.ImageFile.CopyToAsync(stream);
                    }

                    // Assign the image path to the ProductImage field
                    product.ProductImage = "/uploads/" + fileName;
                }

                // Convert ProductModel2 to Product
                var newProduct = new Product
                {
                    ProductTypeId = product.ProductTypeId,
                    DiscountId = product.DiscountId,
                    BrandId = product.BrandId,
                    SupplierId = product.SupplierId,
                    ProductName = product.ProductName,
                    Description = product.Description,
                    Price = product.Price,
                    Unit = product.Unit,
                    Quantity = product.Quantity,
                    IsNew = product.IsNew,
                    Manufacturer = product.Manufacturer,
                    SpecialNote = product.SpecialNote,
                    ProductImage = product.ProductImage,
                    CreateAt = DateTime.Now,
                    //CreatedBy = product.CreatedBy,
                };

                _context.Products.Add(newProduct);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating product.", ex);
            }
        }



        public async Task<string> SaveFile(ProductModel product)
        {
            try
            {
                string fileName = null;

                if (product.ImageFile != null && product.ImageFile.Length > 0)
                {
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await product.ImageFile.CopyToAsync(stream);
                    }
                }

                return fileName;
            }
            catch (Exception ex)
            {
                // Xử lý lỗi tại đây
                throw new Exception("Error occurred while saving file.", ex);
            }
        }

        public async Task Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                throw new InvalidOperationException("Product not found");
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductRequest>> GetAllProductsAsync()
        {
            var products = await _context.Products
                .Include(p => p.Discount) // Join bảng Discount
                .Include(p => p.Brand) // Join bảng Brand
                .ToListAsync();

            var currentTime = DateTime.Now;

            foreach (var product in products)
            {
                if (product.CreateAt.HasValue)
                {
                    if ((currentTime - product.CreateAt.Value).TotalHours >= 1)
                    {
                        product.IsNew = false;
                    }
                    else
                    {
                        product.IsNew = true;
                    }
                }
                else
                {
                    product.IsNew = false;
                }
            }

            await _context.SaveChangesAsync();

            // Ánh xạ danh sách sản phẩm sang ProductRequest và trả về
            return products.Select(product => new ProductRequest
            {
                ProductId = product.ProductId,
                BrandId = product.BrandId,
                ProductTypeId = product.ProductTypeId,
                DiscountId = product.DiscountId,
                ProductName = product.ProductName,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                Unit = product.Unit,
                Manufacturer = product.Manufacturer,
                IsNew = product.IsNew,
                SpecialNote = product.SpecialNote,
                ProductImage = product.ProductImage,
                DiscountValue = product.Discount != null ? product.Discount.DiscountValue : null,
                CreatedAt = product.CreateAt,
                //CreatedBy = product.CreatedBy,
                UpdateAt = product.UpdateAt,
                //UpdateBy = product.UpdateBy,
                CountryOfOrigin = product.Brand != null ? product.Brand.CountryOfOrigin : null 
            });
        }







        public async Task<ProductModel3> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Discount)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null)
            {
                throw new InvalidOperationException("Product not found");
            }

            var productImageDetails = await _context.ProductImageDetails
                .Where(p => p.ProductId == id)
                .ToListAsync();

            var productModel = new ProductModel3
            {
                ProductId = product.ProductId,
                ProductTypeId = product.ProductTypeId,
                DiscountId = product.DiscountId,
                ProductName = product.ProductName,
                Price = product.Price,
                Quantity = product.Quantity,
                Description = product.Description,
                Unit = product.Unit,
                Manufacturer = product.Manufacturer,
                IsNew = product.IsNew,
                SpecialNote = product.SpecialNote,
                ProductImage = product.ProductImage,
                DiscountValue = product.Discount == null ? null : product.Discount.DiscountValue,
                CountryOfOrigin = product.Brand != null ? product.Brand.CountryOfOrigin : null,
                ProductImageDetails = productImageDetails.Select(pid => new ProductImageDetailModel
                {
                    ProductImageId = pid.ProductImageId,
                    ProductId = pid.ProductId,
                    ImageUrl = pid.ImageUrl,
                    Position = pid.Position,
                    IsActive = pid.IsActive,
                }).ToList()
            };

            return productModel;
        }



        public async Task<IEnumerable<ProductModel>> SearchProductsAsync(string keyword)
        {
            var query = from p in _context.Products
                        join pt in _context.ProductTypes on p.ProductTypeId equals pt.ProductTypeId
                        join d in _context.Discounts on p.DiscountId equals d.DiscountId 
                        // Left join with Discounts
                        where string.IsNullOrEmpty(keyword)
                              || p.ProductName.Contains(keyword)
                              || pt.ProductTypeName.Contains(keyword)
                              || d.DiscountValue.ToString().Contains(keyword)
                        select new ProductModel
                        {
                            ProductId = p.ProductId,
                            ProductName = p.ProductName,
                            Description = p.Description,
                            Price = p.Price,
                            Unit = p.Unit,
                            Manufacturer = p.Manufacturer,
                            IsNew = p.IsNew,
                            SpecialNote = p.SpecialNote,
                            ProductImage = p.ProductImage,
                            ProductTypeName = pt.ProductTypeName,
                            DiscountValue = d.DiscountValue
                        };

            return await query.ToListAsync();
        }




        public async Task<Product> Update(int id, ProductModel1 product)
        {
            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                throw new InvalidOperationException("Product not found");
            }

            try
            {
                // Store the current product image path
                string currentImagePath = existingProduct.ProductImage;

                // Handle file upload if a new image is provided
                if (product.ImageFile != null && product.ImageFile.Length > 0)
                {
                    // Generate new file name
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(product.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Upload the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await product.ImageFile.CopyToAsync(stream);
                    }

                    // Update the product image path
                    existingProduct.ProductImage = "/uploads/" + fileName;

                    // Delete the previous image file
                    if (!string.IsNullOrEmpty(currentImagePath))
                    {
                        var currentFilePath = Path.Combine(_env.WebRootPath, currentImagePath.TrimStart('/'));
                        if (File.Exists(currentFilePath))
                        {
                            File.Delete(currentFilePath);
                        }
                    }
                }

                // Update product properties
                existingProduct.ProductTypeId = product.ProductTypeId;
                existingProduct.DiscountId = product.DiscountId;
                existingProduct.BrandId= product.BrandId;
                existingProduct.SupplierId = product.SupplierId;
                existingProduct.ProductName = product.ProductName;
                existingProduct.Description = product.Description;
                existingProduct.Price = product.Price;
                existingProduct.Unit = product.Unit;
                existingProduct.Quantity = product.Quantity;
                existingProduct.Manufacturer = product.Manufacturer;
                existingProduct.IsNew = product.IsNew;
                existingProduct.UpdateAt = DateTime.Now;
                //existingProduct.UpdateBy = product.UpdateBy;

                // Update the existing product in the database
                _context.Products.Update(existingProduct);
                await _context.SaveChangesAsync();

                return existingProduct;
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while updating product.", ex);
            }
        }




        public async Task<IEnumerable<ProductReponse>> GetProductsByProductTypeNameAsync(int ProductTypeId)
        {
            return await _context.Products
                .Where(p => p.ProductType.ProductTypeId == ProductTypeId)
                .Select(b => new ProductReponse
                {
                    ProductId = b.ProductId,
                    ProductName = b.ProductName,
                    Price = b.Price,
                    Quantity = b.Quantity,
                    Unit = b.Unit,
                    Manufacturer = b.Manufacturer,
                    IsNew = b.IsNew,
                    SpecialNote = b.SpecialNote,
                    ProductImage = b.ProductImage,
                    DiscountValue = b.Discount == null ? null : b.Discount.DiscountValue
                }).ToListAsync();
        }
        public async Task<IEnumerable<ProductRequest>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _context.Products
                .Where(b => (b.Discount != null ? b.Price * (1 - b.Discount.DiscountValue) : b.Price) >= minPrice &&
                            (b.Discount != null ? b.Price * (1 - b.Discount.DiscountValue) : b.Price) <= maxPrice)
                .Select(b => new ProductRequest
                {
                    ProductId = b.ProductId,
                    ProductName = b.ProductName,
                    Price = b.Price,
                    Quantity = b.Quantity,
                    Unit = b.Unit,
                    Manufacturer = b.Manufacturer,
                    IsNew = b.IsNew,
                    SpecialNote = b.SpecialNote,
                    ProductImage = b.ProductImage,
                    DiscountValue = b.Discount != null ? b.Discount.DiscountValue : null 
                }).ToListAsync();
        }




        public async Task<IEnumerable<ProductReponse>> GetProductsByPriceProductTypeIdRangeAsync(int productTypeId, decimal minPrice, decimal maxPrice)
        {
            return await _context.Products
                .Where(p => p.ProductType.ProductTypeId == productTypeId && p.Price >= minPrice && p.Price <= maxPrice)
                .Select(p => new ProductReponse
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    Unit = p.Unit,
                    Manufacturer = p.Manufacturer,
                    IsNew = p.IsNew,
                    SpecialNote = p.SpecialNote,
                    ProductImage = p.ProductImage
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ProductRequest>> GetProductRequestsAsync()
        {
            return await _context.Products
                .Where(b => b.Discount != null && b.Discount.DiscountValue != null && b.Discount.DiscountId != 14) // Lọc ra sản phẩm có discount và discountValue đã nhập
                .Select(b => new ProductRequest
                {
                    ProductId = b.ProductId,
                    ProductName = b.ProductName,
                    Price = b.Price,
                    Quantity = b.Quantity,
                    Unit = b.Unit,
                    Manufacturer = b.Manufacturer,
                    IsNew = b.IsNew,
                    SpecialNote = b.SpecialNote,
                    ProductImage = b.ProductImage,
                    DiscountValue = b.Discount.DiscountValue
                })
                .ToListAsync();
        }

    }
}
