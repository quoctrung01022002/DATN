namespace BackEnd_DATN.Request
{
    public class CommentRequest
    {
        public int? ProductId { get; set; }

        //public int? OrderId { get; set; }

        public string Content { get; set; } = null!;

        public int? StarRating { get; set; }

        public int WarningCount { get; set; }
    }
}
