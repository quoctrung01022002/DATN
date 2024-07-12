namespace BackEnd_DATN.Models
{
    public class ChatMessageModel1
    {
        public int MessageId { get; set; }

        public int? SenderId { get; set; }

        public int? ReceiverId { get; set; }

        public string? Content { get; set; }

        public DateTime? SentAt { get; set; }

        public bool? IsRead { get; set; }
    }
}
