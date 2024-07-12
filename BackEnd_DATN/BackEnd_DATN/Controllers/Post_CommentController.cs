//using BackEnd_DATN.Entities;
//using BackEnd_DATN.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;

//namespace BackEnd_DATN.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class Post_CommentController : ControllerBase
//    {
//        private readonly DatnTrung62132908Context _context;

//        public Post_CommentController(DatnTrung62132908Context context)
//        {
//            _context = context;
//        }

//        [HttpGet("Comments")]
//        public async Task<ActionResult<IEnumerable<CommentModel>>> GetComments()
//        {
//            var comments = await _context.Comments.Include(c => c.Product).ToListAsync();
//            return comments.Select(c => new CommentModel
//            {
//                CommentId = c.CommentId,
//                ProductId = c.ProductId,
//                Content = c.Content,
//                UserName = c.UserName,
//                CommentDate = c.CommentDate
//            }).ToList();
//        }

//        [HttpGet("Posts")]
//        public async Task<ActionResult<IEnumerable<PostModel>>> GetPosts()
//        {
//            var posts = await _context.Posts.Include(p => p.PostId).ToListAsync();
//            return posts.Select(p => new PostModel
//            {
//                PostId = p.PostId,
//                UserId = p.UserId,
//                Title = p.Title,
//                Content = p.Content,
//                PostedDate = p.PostedDate
//            }).ToList();
//        }

//        [HttpGet("Products")]
//        public async Task<ActionResult<IEnumerable<ProductModel>>> GetProducts()
//        {
//            var products = await _context.Products.Include(p => p.Comments).Include(p => p.ProductId).ToListAsync();
//            return products.Select(p => new ProductModel
//            {
//                ProductId = p.ProductId,
//                ProductName = p.ProductName,
//                Description = p.Description,
//                Price = p.Price,
//                Weight = p.Weight,
//                Size = p.Size,
//                Manufacturer = p.Manufacturer,
//                Color = p.Color,
//                HasSpecialFeatures = p.HasSpecialFeatures,
//                IsNew = p.IsNew,
//                IsBestseller = p.IsBestseller,
//                IsOnSale = p.IsOnSale,
//                SpecialNote = p.SpecialNote,
//                ProductImage = p.ProductImage
//            }).ToList();
//        }

//        [HttpGet("Comment/{id}")]
//        public async Task<ActionResult<CommentModel>> GetComment(int id)
//        {
//            var comment = await _context.Comments
//                                        .Include(c => c.Product)
//                                        .FirstOrDefaultAsync(c => c.CommentId == id);

//            if (comment == null)
//            {
//                return NotFound();
//            }

//            return new CommentModel
//            {
//                CommentId = comment.CommentId,
//                ProductId = comment.ProductId,
//                Content = comment.Content,
//                UserName = comment.UserName,
//                CommentDate = comment.CommentDate
//            };
//        }

//        [HttpPost("Comment")]
//        public async Task<ActionResult<CommentModel>> PostComment(CommentModel comment)
//        {
//            _context.Comments.Add(new Comment
//            {
//                ProductId = comment.ProductId,
//                Content = comment.Content,
//                UserName = comment.UserName,
//                CommentDate = comment.CommentDate
//            });
//            await _context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetComment), new { id = comment.CommentId }, comment);
//        }

//        [HttpPut("Comment/{id}")]
//        public async Task<IActionResult> PutComment(int id, CommentModel comment)
//        {
//            if (id != comment.CommentId)
//            {
//                return BadRequest();
//            }

//            var existingComment = await _context.Comments.FindAsync(id);
//            if (existingComment == null)
//            {
//                return NotFound();
//            }

//            existingComment.ProductId = comment.ProductId;
//            existingComment.Content = comment.Content;
//            existingComment.UserName = comment.UserName;
//            existingComment.CommentDate = comment.CommentDate;

//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        [HttpDelete("Comment/{id}")]
//        public async Task<IActionResult> DeleteComment(int id)
//        {
//            var comment = await _context.Comments.FindAsync(id);
//            if (comment == null)
//            {
//                return NotFound();
//            }

//            _context.Comments.Remove(comment);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        [HttpGet("Post/{id}")]
//        public async Task<ActionResult<PostModel>> GetPost(int id)
//        {
//            var post = await _context.Posts
//                                    .Include(p => p.PostId)
//                                    .FirstOrDefaultAsync(p => p.PostId == id);

//            if (post == null)
//            {
//                return NotFound();
//            }

//            return new PostModel
//            {
//                PostId = post.PostId,
//                UserId = post.UserId,
//                Title = post.Title,
//                Content = post.Content,
//                PostedDate = post.PostedDate
//            };
//        }

//        [HttpPost("Post")]
//        public async Task<ActionResult<PostModel>> PostPost(PostModel post)
//        {
//            _context.Posts.Add(new Post
//            {
//                UserId = post.UserId,
//                Title = post.Title,
//                Content = post.Content,
//                PostedDate = post.PostedDate
//            });
//            await _context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, post);
//        }

//        [HttpPut("Post/{id}")]
//        public async Task<IActionResult> PutPost(int id, PostModel post)
//        {
//            if (id != post.PostId)
//            {
//                return BadRequest();
//            }

//            var existingPost = await _context.Posts.FindAsync(id);
//            if (existingPost == null)
//            {
//                return NotFound();
//            }

//            existingPost.UserId = post.UserId;
//            existingPost.Title = post.Title;
//            existingPost.Content = post.Content;
//            existingPost.PostedDate = post.PostedDate;

//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        [HttpDelete("Post/{id}")]
//        public async Task<IActionResult> DeletePost(int id)
//        {
//            var post = await _context.Posts.FindAsync(id);
//            if (post == null)
//            {
//                return NotFound();
//            }

//            _context.Posts.Remove(post);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        [HttpGet("Product/{id}")]
//        public async Task<ActionResult<ProductModel>> GetProduct(int id)
//        {
//            var product = await _context.Products
//                                        .Include(p => p.Comments)
//                                        .Include(p => p.ProductId)
//                                        .FirstOrDefaultAsync(p => p.ProductId == id);

//            if (product == null)
//            {
//                return NotFound();
//            }

//            return new ProductModel
//            {
//                ProductId = product.ProductId,
//                ProductName = product.ProductName,
//                Description = product.Description,
//                Price = product.Price,
//                Weight = product.Weight,
//                Size = product.Size,
//                Manufacturer = product.Manufacturer,
//                Color = product.Color,
//                HasSpecialFeatures = product.HasSpecialFeatures,
//                IsNew = product.IsNew,
//                IsBestseller = product.IsBestseller,
//                IsOnSale = product.IsOnSale,
//                SpecialNote = product.SpecialNote,
//                ProductImage = product.ProductImage
//            };
//        }

//        [HttpPost("Product")]
//        public async Task<ActionResult<ProductModel>> PostProduct(ProductModel product)
//        {
//            _context.Products.Add(new Product
//            {
//                ProductName = product.ProductName,
//                Description = product.Description,
//                Price = product.Price,
//                Weight = product.Weight,
//                Size = product.Size,
//                Manufacturer = product.Manufacturer,
//                Color = product.Color,
//                HasSpecialFeatures = product.HasSpecialFeatures,
//                IsNew = product.IsNew,
//                IsBestseller = product.IsBestseller,
//                IsOnSale = product.IsOnSale,
//                SpecialNote = product.SpecialNote,
//                ProductImage = product.ProductImage
//            });
//            await _context.SaveChangesAsync();

//            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, product);
//        }

//        [HttpPut("Product/{id}")]
//        public async Task<IActionResult> PutProduct(int id, ProductModel product)
//        {
//            if (id != product.ProductId)
//            {
//                return BadRequest();
//            }

//            var existingProduct = await _context.Products.FindAsync(id);
//            if (existingProduct == null)
//            {
//                return NotFound();
//            }

//            existingProduct.ProductName = product.ProductName;
//            existingProduct.Description = product.Description;
//            existingProduct.Price = product.Price;
//            existingProduct.Weight = product.Weight;
//            existingProduct.Size = product.Size;
//            existingProduct.Manufacturer = product.Manufacturer;
//            existingProduct.Color = product.Color;
//            existingProduct.HasSpecialFeatures = product.HasSpecialFeatures;
//            existingProduct.IsNew = product.IsNew;
//            existingProduct.IsBestseller = product.IsBestseller;
//            existingProduct.IsOnSale = product.IsOnSale;
//            existingProduct.SpecialNote = product.SpecialNote;
//            existingProduct.ProductImage = product.ProductImage;

//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        [HttpDelete("Product/{id}")]
//        public async Task<IActionResult> DeleteProduct(int id)
//        {
//            var product = await _context.Products.FindAsync(id);
//            if (product == null)
//            {
//                return NotFound();
//            }

//            _context.Products.Remove(product);
//            await _context.SaveChangesAsync();

//            return NoContent();
//        }

//        private bool CommentExists(int id)
//        {
//            return _context.Comments.Any(e => e.CommentId == id);
//        }

//        private bool PostExists(int id)
//        {
//            return _context.Posts.Any(e => e.PostId == id);
//        }

//        private bool ProductExists(int id)
//        {
//            return _context.Products.Any(e => e.ProductId == id);
//        }
//    }
//}
