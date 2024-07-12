using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class ProductImageDetailModel
    {
        public int ProductImageId { get; set; }

        public int? ProductId { get; set; }

        public string? ImageUrl { get; set; }

        public int Position { get; set; }

        public bool IsActive { get; set; }

        public DateTime? CreateAt { get; set; }

        public string? CreatedBy { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
