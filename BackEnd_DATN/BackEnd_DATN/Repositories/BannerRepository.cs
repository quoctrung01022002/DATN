using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Repositories
{
    public class BannerRepository : IBannerRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;

        public BannerRepository(DatnTrung62132908Context context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task Create(BannerModel banner)
        {
            try
            {
                if (_context.Banners.Any(b => b.Sort == banner.Sort))
                {
                    throw new Exception("Banner with the same sort value already exists.");
                }

                string fileName = null;

                if (banner.ImageFile != null && banner.ImageFile.Length > 0)
                {
                    // Get file name
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(banner.ImageFile.FileName);
                    // File path to store the image in wwwroot/uploads
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Store file in wwwroot/uploads directory
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await banner.ImageFile.CopyToAsync(stream);
                    }

                    // Assign the image path to the ImageUrl field
                    banner.ImageUrl = "/uploads/" + fileName;
                }

                // Convert BannerModel to Banner
                var newBanner = new Banner
                {
                    ImageUrl = banner.ImageUrl,
                    Title = banner.Title,
                    Description = banner.Description,
                    Sort = banner.Sort,
                    CreatedAt = DateTime.Now,
                    //CreatedBy = banner.CreatedBy,
                    IsActive = true
                };

                _context.Banners.Add(newBanner);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating banner.", ex);
            }
        }

        public async Task<Banner> GetById(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
            {
                return null;
            }

            return new Banner
            {
                BannerId = banner.BannerId,
                ImageUrl = banner.ImageUrl,
                Title = banner.Title,
                Description = banner.Description,
                Sort = banner.Sort,
                CreatedAt = banner.CreatedAt,
                //CreatedBy = banner.CreatedBy,
                UpdatedAt = banner.UpdatedAt,
                //UpdatedBy = banner.UpdatedBy,
                IsActive = banner.IsActive
            };
        }

        public async Task Update(Banner2Model banner)
        {
            var existingBanner = await _context.Banners.FindAsync(banner.BannerId);
            if (existingBanner == null)
            {
                throw new InvalidOperationException("Banner not found.");
            }

            try
            {
                // Check if any other banner already exists with the same sort value
                if (_context.Banners.Any(b => b.Sort == banner.Sort && b.BannerId != banner.BannerId))
                {
                    throw new Exception("Another banner with the same sort value already exists.");
                }

                // Store the current banner image path
                string currentImagePath = existingBanner.ImageUrl;

                // Handle file upload if a new image is provided
                if (banner.ImageFile != null && banner.ImageFile.Length > 0)
                {
                    // Generate new file name
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(banner.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Upload the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await banner.ImageFile.CopyToAsync(stream);
                    }

                    // Update the banner image path
                    existingBanner.ImageUrl = "/uploads/" + fileName;

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

                // Update banner properties
                existingBanner.Title = banner.Title;
                existingBanner.Description = banner.Description;
                existingBanner.Sort = banner.Sort;
                existingBanner.UpdatedAt = DateTime.Now;
                //existingBanner.UpdatedBy = banner.UpdatedBy;
                existingBanner.IsActive = banner.IsActive;

                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while updating banner.", ex);
            }
        }




        public async Task Delete(int id)
        {
            var banner = await _context.Banners.FindAsync(id);
            if (banner == null)
            {
                throw new InvalidOperationException("Banner not found.");
            }

            _context.Banners.Remove(banner);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Banner>> GetAll()
        {
            var banners = await _context.Banners.ToListAsync();
            return banners.Select(banner => new Banner
            {
                BannerId = banner.BannerId,
                ImageUrl = banner.ImageUrl,
                Title = banner.Title,
                Description = banner.Description,
                Sort = banner.Sort,
                CreatedAt = banner.CreatedAt,
                //CreatedBy = banner.CreatedBy,
                UpdatedAt = banner.UpdatedAt,
                //UpdatedBy = banner.UpdatedBy,
                IsActive = banner.IsActive
            }).ToList();
        }
    }
}
