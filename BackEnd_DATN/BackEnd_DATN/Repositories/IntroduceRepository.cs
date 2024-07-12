using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace BackEnd_DATN.Repositories
{
    public class IntroduceRepository : IIntroduceRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;

        public IntroduceRepository(DatnTrung62132908Context context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task Create(IntroduceModel introduce)
        {
            try
            {
                // Check if an introduce with the same title already exists
                if (_context.Introduces.Any(i => i.Title == introduce.Title))
                {
                    throw new Exception("Introduce with the same title already exists.");
                }

                // Handle file upload if an image is provided
                string imageUrl = null;
                if (introduce.ImageFile != null && introduce.ImageFile.Length > 0)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(introduce.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await introduce.ImageFile.CopyToAsync(stream);
                    }

                    imageUrl = "/uploads/" + fileName;
                }

                // Create new introduce
                var newIntroduce = new Introduce
                {
                    Title = introduce.Title,
                    Content = introduce.Content,
                    ImageUrl = imageUrl,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                };

                _context.Introduces.Add(newIntroduce);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating introduce.", ex);
            }
        }

        public async Task<Introduce> GetById(int id)
        {
            try
            {
                var introduce = await _context.Introduces.FindAsync(id);
                return introduce;
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while getting introduce by id.", ex);
            }
        }

        public async Task Update(IntroduceModel2 introduce)
        {
            try
            {
                var existingIntroduce = await _context.Introduces.FindAsync(introduce.IntroduceId);
                if (existingIntroduce == null)
                {
                    throw new InvalidOperationException("Introduce not found.");
                }

                // Handle file upload if a new image is provided
                if (introduce.ImageFile != null && introduce.ImageFile.Length > 0)
                {
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(introduce.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await introduce.ImageFile.CopyToAsync(stream);
                    }

                    // Delete the previous image file if it exists
                    if (!string.IsNullOrEmpty(existingIntroduce.ImageUrl))
                    {
                        var currentFilePath = Path.Combine(_env.WebRootPath, existingIntroduce.ImageUrl.TrimStart('/'));
                        if (File.Exists(currentFilePath))
                        {
                            File.Delete(currentFilePath);
                        }
                    }

                    existingIntroduce.ImageUrl = "/uploads/" + fileName;
                }

                // Update introduce properties
                existingIntroduce.Title = introduce.Title;
                existingIntroduce.Content = introduce.Content;
                existingIntroduce.UpdatedAt = DateTime.Now;
                existingIntroduce.IsActive = introduce.IsActive;

                _context.Entry(existingIntroduce).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while updating introduce.", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var introduce = await _context.Introduces.FindAsync(id);
                if (introduce == null)
                {
                    throw new InvalidOperationException("Introduce not found.");
                }

                // Delete image file if it exists
                if (!string.IsNullOrEmpty(introduce.ImageUrl))
                {
                    var currentFilePath = Path.Combine(_env.WebRootPath, introduce.ImageUrl.TrimStart('/'));
                    if (File.Exists(currentFilePath))
                    {
                        File.Delete(currentFilePath);
                    }
                }

                _context.Introduces.Remove(introduce);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while deleting introduce.", ex);
            }
        }

        public async Task<List<Introduce>> GetAll()
        {
            try
            {
                var introduces = await _context.Introduces.ToListAsync();
                return introduces;
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while getting all introduces.", ex);
            }
        }
    }
}
