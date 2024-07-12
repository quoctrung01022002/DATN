using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd_DATN.Repositories
{
    public class ProductImageDetailRepository : IProductImageDeatailRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;

        public ProductImageDetailRepository(DatnTrung62132908Context context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task Create(ProductImageDetailModel productImageDetail)
        {
            try
            {
                // Check if any other product image detail already exists with the same position value
                if (_context.ProductImageDetails.Any(p => p.Position == productImageDetail.Position))
                {
                    throw new Exception("Product image detail with the same position value already exists.");
                }

                string fileName = null;

                if (productImageDetail.ImageFile != null && productImageDetail.ImageFile.Length > 0)
                {
                    // Generate new file name
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(productImageDetail.ImageFile.FileName);
                    // File path to store the image in wwwroot/uploads
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Store file in wwwroot/uploads directory
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productImageDetail.ImageFile.CopyToAsync(stream);
                    }

                    // Assign the image path to the ImageUrl field
                    productImageDetail.ImageUrl = "/uploads/" + fileName;
                }

                // Convert ProductImageDetailModel to ProductImageDetail
                var newProductImageDetail = new ProductImageDetail
                {
                    ProductId = productImageDetail.ProductId,
                    ImageUrl = productImageDetail.ImageUrl,
                    Position = productImageDetail.Position,
                    IsActive = productImageDetail.IsActive,
                    CreateAt = DateTime.Now,
                    //CreatedBy = productImageDetail.CreatedBy
                };

                _context.ProductImageDetails.Add(newProductImageDetail);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating product image detail.", ex);
            }
        }

        public async Task Update(ProductImageDetailModel1 productImageDetail)
        {
            try
            {
                // Tìm kiếm chi tiết hình ảnh sản phẩm dựa trên ProductImageId
                var existingProductImageDetail = await _context.ProductImageDetails.FindAsync(productImageDetail.ProductImageId);

                // Kiểm tra xem chi tiết hình ảnh sản phẩm có tồn tại không
                if (existingProductImageDetail == null)
                {
                    throw new InvalidOperationException("Product image detail not found.");
                }

                // Kiểm tra xem có chi tiết hình ảnh sản phẩm khác đã tồn tại với cùng giá trị vị trí không
                if (_context.ProductImageDetails.Any(p => p.Position == productImageDetail.Position && p.ProductImageId != productImageDetail.ProductImageId))
                {
                    throw new Exception("Another product image detail with the same position value already exists.");
                }

                // Lưu đường dẫn hình ảnh hiện tại
                string currentImagePath = existingProductImageDetail.ImageUrl;

                // Xử lý tải lên file hình ảnh mới nếu có được cung cấp
                if (productImageDetail.ImageFile != null && productImageDetail.ImageFile.Length > 0)
                {
                    // Tạo tên file mới
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(productImageDetail.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Tải lên file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await productImageDetail.ImageFile.CopyToAsync(stream);
                    }

                    // Cập nhật đường dẫn hình ảnh
                    existingProductImageDetail.ImageUrl = "/uploads/" + fileName;

                    // Xóa file hình ảnh trước đó
                    if (!string.IsNullOrEmpty(currentImagePath))
                    {
                        var currentFilePath = Path.Combine(_env.WebRootPath, currentImagePath.TrimStart('/'));
                        if (File.Exists(currentFilePath))
                        {
                            File.Delete(currentFilePath);
                        }
                    }
                }

                // Cập nhật các thuộc tính của chi tiết hình ảnh sản phẩm
                existingProductImageDetail.ProductId = productImageDetail.ProductId;
                existingProductImageDetail.Position = productImageDetail.Position;
                existingProductImageDetail.IsActive = productImageDetail.IsActive;

                // Kiểm tra và cập nhật ngày cập nhật và người cập nhật
                if (existingProductImageDetail.UpdateAt == null || existingProductImageDetail.UpdateAt.GetValueOrDefault().Date == DateTime.MinValue)
                {
                    existingProductImageDetail.UpdateAt = DateTime.Now;
                }


                if (string.IsNullOrEmpty(existingProductImageDetail.UpdateBy))
                {
                    existingProductImageDetail.UpdateBy = productImageDetail.UpdateBy;
                }

                // Lưu các thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Xử lý lỗi
                throw new Exception("Error occurred while updating product image detail.", ex);
            }
        }



        public async Task Delete(int id)
        {
            var productImageDetail = await _context.ProductImageDetails.FindAsync(id);
            if (productImageDetail == null)
            {
                throw new InvalidOperationException("Product image detail not found.");
            }

            _context.ProductImageDetails.Remove(productImageDetail);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductImageDetail> GetById(int id)
        {
            var productImageDetail = await _context.ProductImageDetails.FindAsync(id);
            if (productImageDetail == null)
            {
                return null;
            }

            return new ProductImageDetail
            {
                ProductImageId = productImageDetail.ProductImageId,
                ProductId = productImageDetail.ProductId,
                ImageUrl = productImageDetail.ImageUrl,
                Position = productImageDetail.Position,
                IsActive = productImageDetail.IsActive,
                UpdateAt = productImageDetail.UpdateAt,
                UpdateBy = productImageDetail.UpdateBy
            };
        }

        public async Task<List<ProductImageDetail>> GetAll()
        {
            var productImageDetails = await _context.ProductImageDetails.ToListAsync();
            return productImageDetails.Select(productImageDetail => new ProductImageDetail
            {
                ProductImageId = productImageDetail.ProductImageId,
                ProductId = productImageDetail.ProductId,
                ImageUrl = productImageDetail.ImageUrl,
                Position = productImageDetail.Position,
                IsActive = productImageDetail.IsActive,
                CreateAt = productImageDetail.CreateAt,
                //CreatedBy = productImageDetail.CreatedBy,
                UpdateAt = productImageDetail.UpdateAt,
                UpdateBy = productImageDetail.UpdateBy
            }).ToList();
        }
    }
}
