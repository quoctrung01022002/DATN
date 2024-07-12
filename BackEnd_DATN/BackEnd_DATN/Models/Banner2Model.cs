using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class Banner2Model
    {
        public int? BannerId { get; set; }

        public string? ImageUrl { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public int? Sort { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public string? UpdatedBy { get; set; }

        public bool IsActive { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
