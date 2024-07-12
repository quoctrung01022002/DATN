using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class PostModel1
    {
        public int? PostId { get; set; }

        public string Title { get; set; } = null!;

        public string Content { get; set; } = null!;

        public string? ImageUrl { get; set; }

        public DateTime? UpdateAt { get; set; }

        public string? UpdateBy { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
