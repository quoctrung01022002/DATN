using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class ProductImageDetailModel1
    {
        public int? ProductImageId { get; set; }

        public int? ProductId { get; set; }

        public string? ImageUrl { get; set; }

        public int Position { get; set; }

        public bool IsActive { get; set; }

        public DateTime? UpdateAt { get; set; }

        public string? UpdateBy { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
