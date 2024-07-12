using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class IntroduceModel2
    {
        public int? IntroduceId { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public string? ImageUrl { get; set; }

        public bool IsActive { get; set; }

        public DateTime? UpdatedAt { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
