using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace BackEnd_DATN.Repositories
{
    public class PostRepository : IPostRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;

        public PostRepository(DatnTrung62132908Context context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task Create(PostModel post)
        {
            try
            {
                string fileName = null;

                if (post.ImageFile != null && post.ImageFile.Length > 0)
                {
                    // Get file name
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(post.ImageFile.FileName);
                    // File path to store the image in wwwroot/uploads
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Store file in wwwroot/uploads directory
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await post.ImageFile.CopyToAsync(stream);
                    }

                    // Assign the image path to the ImageUrl field
                    post.ImageUrl = "/uploads/" + fileName;
                }
                var newPost = new Post
                {
                    Title = post.Title,
                    Content = post.Content,
                    ImageUrl = post.ImageUrl,
                    CreateAt = DateTime.Now,
                    //CreatedBy = post.CreatedBy,
                };
                _context.Posts.Add(newPost);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating post.", ex);
            }
        }

        public async Task Delete(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {              
                    throw new InvalidOperationException("Post not found.");             
            }
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Post>> GetAll()
        {
            var post = await _context.Posts.ToListAsync();
            return post.Select(post => new Post 
            { 
                PostId = post.PostId,
                Title = post.Title,
                Content = post.Content ,
                ImageUrl = post.ImageUrl,
                CreateAt = DateTime.Now,
                //CreatedBy = post.CreatedBy,
                UpdateAt = DateTime.Now,
                //UpdateBy = post.UpdateBy,
            }).ToList();

        }

        public async Task<Post> GetById(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return null;
            }
            return new Post
            {
                PostId = post.PostId,
                Title = post.Title,
                Content = post.Content,
                ImageUrl = post.ImageUrl,
                CreateAt = DateTime.Now,
                //CreatedBy = post.CreatedBy,
                UpdateAt = DateTime.Now,
                //UpdateBy = post.UpdateBy,
            };
        }

        public async Task Update(PostModel1 post)
        {
            var existingPost = await _context.Posts.FindAsync(post.PostId);
            if(existingPost == null)
            {
                throw new InvalidOperationException("Post not found.");
            }
            try
            {
                string currentImagePath = existingPost.ImageUrl;

                // Handle file upload if a new image is provided
                if (post.ImageFile != null && post.ImageFile.Length > 0)
                {
                    // Generate new file name
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(post.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Upload the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await post.ImageFile.CopyToAsync(stream);
                    }

                    // Update the banner image path
                    existingPost.ImageUrl = "/uploads/" + fileName;

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
                existingPost.Title = post.Title;
                existingPost.Content = post.Content;
                existingPost.UpdateAt = DateTime.Now;
                //existingPost.UpdateBy = post.UpdateBy;
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while updating post.", ex);
            }
        }
    }
}
