using BackEnd_DATN.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class AdminHub : Hub
{
    private readonly DatnTrung62132908Context _context;

    public AdminHub(DatnTrung62132908Context context)
    {
        _context = context;
    }

    public string GetConnectionId
    {
        get {
            return Context.ConnectionId;
        }
    }

    public async Task SendMessage(int receiverId, string content)
    {
        var senderId = GetUserIdFromContext();

        var message = new ChatMessage
        {
            ReceiverId = receiverId,
            SenderId = senderId, // Thêm người gửi vào tin nhắn
            Content = content,
            SentAt = DateTime.UtcNow,
            IsRead = false,

        };

        _context.ChatMessages.Add(message);
        await _context.SaveChangesAsync();

        // Cập nhật danh sách tin nhắn của người gửi
        var sender = await _context.Users.Include(u => u.ChatMessageSenders).FirstOrDefaultAsync(u => u.UserId == senderId);
        sender.ChatMessageSenders.Add(message);

        // Cập nhật danh sách tin nhắn của người nhận
        var receiver = await _context.Users.Include(u => u.ChatMessageReceivers).FirstOrDefaultAsync(u => u.UserId == receiverId);
        receiver.ChatMessageReceivers.Add(message);

        await _context.SaveChangesAsync();

        // Gửi tin nhắn tới người nhận
        await Clients.User(receiverId.ToString()).SendAsync("ReceiveMessage", message);
    }

    public async Task SendMessageToCustomers(List<int> receiverIds, string content)
    {
        var senderId = GetUserIdFromContext();

        var messages = new List<ChatMessage>();

        // Gửi tin nhắn tới từng khách hàng trong danh sách
        foreach (var receiverId in receiverIds)
        {
            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            messages.Add(message);

            _context.ChatMessages.Add(message);

            // Cập nhật danh sách tin nhắn của người gửi
            var sender = await _context.Users.Include(u => u.ChatMessageSenders).FirstOrDefaultAsync(u => u.UserId == senderId);
            sender.ChatMessageSenders.Add(message);

            // Cập nhật danh sách tin nhắn của người nhận
            var receiver = await _context.Users.Include(u => u.ChatMessageReceivers).FirstOrDefaultAsync(u => u.UserId == receiverId);
            receiver.ChatMessageReceivers.Add(message);
        }

        await _context.SaveChangesAsync();

        // Gửi tin nhắn đến từng khách hàng
        foreach (var message in messages)
        {
            await Clients.User(message.ReceiverId.ToString()).SendAsync("ReceiveMessage", message);
        }
    }

    private int GetUserIdFromContext()
    {
        var userIdClaim = Context.User.FindFirst("userId")?.Value;
        if (userIdClaim == null || !int.TryParse(userIdClaim, out int senderId))
        {
            throw new HubException("Unauthorized");
        }

        return senderId;
    }
}
