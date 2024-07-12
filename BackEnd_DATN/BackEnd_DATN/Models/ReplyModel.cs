namespace BackEnd_DATN.Models
{
    public class ReplyModel
    {
        public int ReplyId { get; set; }

        public int CommentId { get; set; }

        public int UserId { get; set; }

        public string Content { get; set; }

        public DateTime ReplyDate { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }
    }
}
