using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly DatnTrung62132908Context _context;
        private readonly ILogger<CommentController> _logger;

        public CommentController(DatnTrung62132908Context context, ILogger<CommentController> logger)
        {
            _context = context;
            _logger = logger;
        }
        private readonly List<string> forbiddenWords = new List<string>
        {
           "gian lận",
            "lừa đảo",
            "độc hại",
            "giả mạo",
            "hàng nhái",
            "kém chất lượng",
            "không rõ nguồn gốc",
            "quá hạn",
            "bẩn",
            "thối",
            "hư",
            "lỗi"
        };
        private bool ContainsForbiddenWords(string text, List<string> forbiddenWords)
        {
            foreach (var word in forbiddenWords)
            {
                if (text.Contains(word, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetCommentsForProduct(int productId)
        {
            try
            {
                var comments = await (from cm in _context.Comments
                                      join rp in _context.Replies on cm.CommentId equals rp.CommentId into commentReplies
                                      join user in _context.Users on cm.UserId equals user.UserId
                                      where cm.ProductId == productId
                                      select new CommentModel
                                      {
                                          FirstName = user.FirstName,
                                          LastName = user.LastName,
                                          CommentId = cm.CommentId,
                                          Content = cm.Content,
                                          StarRating = cm.StarRating,
                                          CommentDate = cm.CommentDate,
                                          Replies = commentReplies.Select(rp => new ReplyModel
                                          {
                                              // Thay vì sử dụng thông tin của người bình luận, sử dụng thông tin của người reply
                                              UserId = rp.UserId,
                                              FirstName = rp.User.FirstName,
                                              LastName = rp.User.LastName,
                                              ReplyId = rp.ReplyId,
                                              Content = rp.Content,
                                              ReplyDate = rp.ReplyDate
                                          }).ToList()
                                      }).ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        //[Authorize]
        //[HttpPost("AddStar")]
        //public async Task<IActionResult> AddStar(StarRequest _comment)
        //{
        //    try
        //    {
        //        var userIdClaim = User.FindFirst("userId")?.Value;

        //        if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
        //        {
        //            return Unauthorized();
        //        }

        //        var currentTime = DateTime.Now;

        //        var lastOrderTime = await _context.Orders
        //            .Where(o => o.UserId == userId && o.Status == 1)
        //            .OrderByDescending(o => o.OrderDate)
        //            .Select(o => o.OrderDate)
        //            .FirstOrDefaultAsync();

        //        if (lastOrderTime == null || (currentTime - lastOrderTime).TotalHours > 3)
        //        {
        //            return BadRequest("You can only add comments three hours after placing a successful order.");
        //        }

        //        var existingComment = await _context.Comments
        //            .FirstOrDefaultAsync(c => c.ProductId == _comment.ProductId && c.UserId == userId);

        //        if (existingComment != null)
        //        {
        //            return BadRequest("You have already commented on this product.");
        //        }

        //        var comment = new Comment
        //        {
        //            ProductId = _comment.ProductId,
        //            StarRating = _comment.StarRating                  
        //        };

        //        _context.Comments.Add(comment);
        //        await _context.SaveChangesAsync();

        //        return Ok("Comment added successfully");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //    }
        //}





        [HttpPost]
        public async Task<IActionResult> AddComment(CommentRequest _comment)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var isValid = int.TryParse(userIdClaim, out int userId);

                if (!isValid)
                {
                    return Unauthorized();
                }

                // Kiểm tra trạng thái của đơn hàng và kiểm tra xem sản phẩm đã được mua hay chưa
                var hasPurchasedProduct = await (from o in _context.Orders
                                                 join od in _context.OrderDetails on o.OrderId equals od.OrderId
                                                 join u in _context.Users on o.UserId equals u.UserId
                                                 where o.Status == 3 && u.UserId == userId && od.ProductId == _comment.ProductId
                                                 select o).AnyAsync();

                if (!hasPurchasedProduct)
                {
                    return StatusCode(406, "You have not purchased this product.");
                }

                // Kiểm tra xem người dùng có quá số lần cảnh báo không
                var warningLog = await _context.WarningLogs
                    .Where(w => w.UserId == userId)
                    .FirstOrDefaultAsync();

                if (warningLog != null && warningLog.WarningCount >= 3)
                {
                    return StatusCode(405, "Your comment contains forbidden words.");
                }

                // Kiểm tra xem bình luận có từ cấm không
                if (ContainsForbiddenWords(_comment.Content, forbiddenWords))
                {
                    // Nếu từ cấm được phát hiện, cập nhật hoặc thêm vào bảng WarningLog
                    if (warningLog == null)
                    {
                        warningLog = new WarningLog
                        {
                            UserId = userId,
                            WarningTime = DateTime.Now,
                            WarningCount = 1
                        };
                        _context.WarningLogs.Add(warningLog);
                    }
                    else
                    {
                        warningLog.WarningCount++;
                    }

                    await _context.SaveChangesAsync();

                    return StatusCode(405, "Your comment contains forbidden words.");
                }

                // Nếu không có từ cấm, thêm bình luận vào bảng Comments và trả về kết quả thành công
                var comment = new Comment
                {
                    ProductId = _comment.ProductId,
                    UserId = userId,
                    Content = _comment.Content,
                    StarRating = _comment.StarRating,
                    CommentDate = DateTime.Now
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                return Ok("Comment added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [Authorize]
        [HttpPost("addReply")]
        public async Task<IActionResult> AddReply(ReplyRequest _reply)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var isValid = int.TryParse(userIdClaim, out int userId);

                if (!isValid)
                {
                    return Unauthorized();
                }

                // Kiểm tra số lượng cảnh báo của người dùng
                var warningLog = await _context.WarningLogs
                    .Where(w => w.UserId == userId)
                    .FirstOrDefaultAsync();

                // Nếu số lượng cảnh báo vượt quá giới hạn
                if (warningLog != null && warningLog.WarningCount >= 3)
                {
                    return StatusCode(405,"Your account has been blocked due to too many warnings.");
                }

                // Kiểm tra nội dung trả lời có từ cấm không
                if (ContainsForbiddenWords(_reply.Content, forbiddenWords))
                {
                    // Nếu nội dung chứa từ cấm, tăng cảnh báo và tạo hoặc cập nhật một bản ghi cảnh báo mới
                    if (warningLog == null)
                    {
                        warningLog = new WarningLog
                        {
                            UserId = userId,
                            WarningTime = DateTime.Now,
                            WarningCount = 1
                        };
                        _context.WarningLogs.Add(warningLog);
                    }
                    else
                    {
                        warningLog.WarningCount++;
                    }

                    await _context.SaveChangesAsync();

                    return StatusCode(406,"Your reply contains forbidden words.");
                }

                // Tạo trả lời mới và thêm vào cơ sở dữ liệu
                var reply = new Reply
                {
                    CommentId = _reply.CommentId,
                    UserId = userId,
                    Content = _reply.Content,
                    ReplyDate = DateTime.Now
                };

                _context.Replies.Add(reply);
                await _context.SaveChangesAsync();

                return Ok("Reply added successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }




        [Authorize]
        [HttpDelete("comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var isValid = int.TryParse(userIdClaim, out int userId);

                if (!isValid)
                {
                    return Unauthorized();
                }

                var comment = await _context.Comments.FirstOrDefaultAsync(c => c.CommentId == commentId && c.UserId == userId);

                if (comment == null)
                {
                    return NotFound("Comment not found or you don't have permission to delete it");
                }

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                return Ok("Comment deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpDelete("reply/{replyId}")]
        public async Task<IActionResult> DeleteReply(int replyId)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;

                if (userIdClaim == null)
                {
                    return Unauthorized();
                }

                var isValid = int.TryParse(userIdClaim, out int userId);

                if (!isValid)
                {
                    return Unauthorized();
                }

                var reply = await _context.Replies.FirstOrDefaultAsync(r => r.ReplyId == replyId && r.UserId == userId);

                if (reply == null)
                {
                    return NotFound("Reply not found or you don't have permission to delete it");
                }

                _context.Replies.Remove(reply);
                await _context.SaveChangesAsync();

                return Ok("Reply deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("total-rating/{productId}")]
        public async Task<IActionResult> GetTotalStarRatingForProduct(int productId)
        {
            try
            {
                // Truy xuất tổng số sao đánh giá và tổng số đánh giá cho sản phẩm
                var ratings = await _context.Comments
                    .Where(c => c.ProductId == productId)
                    .Select(c => c.StarRating)
                    .ToListAsync();

                // Tính tổng số sao đánh giá
                var totalStarRating = ratings.Sum();

                // Đếm tổng số đánh giá
                var totalRatingsCount = ratings.Count();

                // Tính trung bình StarRating
                double averageRating = totalRatingsCount > 0 ? (double)totalStarRating / totalRatingsCount : 0;

                return Ok(new { AverageRating = averageRating });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }




    }
}
