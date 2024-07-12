using System.Collections.Generic;
using BackEnd_DATN.Entities;

namespace BackEnd_DATN.Models
{
    public class ChatMessageModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ImageUser { get; set; }
        public List<ChatMessageModel1> ChatMessages { get; set; }

        public ChatMessageModel()
        {
            ChatMessages = new List<ChatMessageModel1>(); // Khởi tạo danh sách người dùng trong constructor
        }
    }
}
