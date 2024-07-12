using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class BannerModel
    {
        public int BannerId { get; set; }

        public string? ImageUrl { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public int? Sort { get; set; }

        public DateTime? CreatedAt { get; set; }

        public string? CreatedBy { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
