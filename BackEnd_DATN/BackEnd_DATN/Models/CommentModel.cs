namespace BackEnd_DATN.Models
{
    public class CommentModel
    {
        public int CommentId { get; set; }

        public int? ProductId { get; set; }

        public int? UserId { get; set; }

        public string Content { get; set; } = null!;

        public DateTime CommentDate { get; set; }

        public int? StarRating { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public List<ReplyModel> Replies { get; set; } // Define the Replies property

        public CommentModel()
        {
            Replies = new List<ReplyModel>(); // Initialize the Replies property in the constructor
        }
    }
}
