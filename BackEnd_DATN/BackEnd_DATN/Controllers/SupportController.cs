using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Google.Apis.Gmail.v1.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportController : ControllerBase
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IHubContext<AdminHub> _adminHubContext; // Thêm IHubContext để sử dụng SignalR

        public SupportController(DatnTrung62132908Context context, IHubContext<AdminHub> adminHubContext)
        {
            _context = context;
            _adminHubContext = adminHubContext; // Khởi tạo IHubContext
        }

        [HttpGet("Customers")]
        public async Task<ActionResult<List<ChatMessageModel>>> GetCustomers()
        {
            var customers = await _context.Users
                .Where(u => u.RoleName == "Customer")
                .Select(u => new ChatMessageModel
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    ImageUser = u.ImageUser,
                    ChatMessages = _context.ChatMessages
                        .Where(m => m.SenderId == u.UserId)
                        .Select(m => new ChatMessageModel1
                        {
                            MessageId = m.MessageId,
                            SenderId = m.SenderId,
                            ReceiverId = m.ReceiverId,
                            Content = m.Content,
                            SentAt = m.SentAt,
                            IsRead = m.IsRead
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(customers);
        }

        [HttpGet("MessagesBySenderId/{senderId}/{receiverId}")]
        public async Task<ActionResult<List<ChatMessageModel>>> GetMessagesBySenderId(int senderId, int receiverId)
        {
            var messages = await _context.Users
                .Where(u => u.UserId == senderId)
                .Select(u => new ChatMessageModel
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    ImageUser = u.ImageUser,
                    ChatMessages = _context.ChatMessages
                        .Where(m => (m.SenderId == senderId && m.ReceiverId == receiverId) || (m.SenderId == receiverId && m.ReceiverId == senderId))
                        .Select(m => new ChatMessageModel1
                        {
                            MessageId = m.MessageId,
                            SenderId = m.SenderId,
                            ReceiverId = m.ReceiverId,
                            Content = m.Content,
                            SentAt = m.SentAt,
                            IsRead = m.IsRead
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(messages);
        }






        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDTO messageDTO)
        {
            try
            {
                int receiverId = messageDTO.ReceiverId;
                string content = messageDTO.Content;

                // Lấy ID của nhân viên hỗ trợ từ người đăng nhập hiện tại
                var supportId = GetSupportUserIdFromContext();

                // Tạo tin nhắn mới
                var message = new ChatMessage
                {
                    SenderId = supportId,
                    ReceiverId = receiverId,
                    Content = content,
                    SentAt = DateTime.UtcNow,
                    IsRead = false
                };

                // Thêm tin nhắn vào cơ sở dữ liệu
                _context.ChatMessages.Add(message);
                await _context.SaveChangesAsync();

                // Gửi tin nhắn đến người nhận sử dụng SignalR
                await _adminHubContext.Clients.All.SendAsync("ReceiveMessage", message);
                message.IsRead = true;
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        // Phương thức riêng để lấy ID của nhân viên hỗ trợ từ người đăng nhập hiện tại
        private int GetSupportUserIdFromContext()
        {
            var userIdClaim = HttpContext.User.FindFirst("userId")?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int supportUserId))
            {
                throw new HubException("Unauthorized");
            }

            return supportUserId;
        }
    }
}
