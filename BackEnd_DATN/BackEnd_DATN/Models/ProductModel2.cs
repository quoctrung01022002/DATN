using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class ProductModel2
    {
        public int ProductId { get; set; }

        public int? BrandId { get; set; }

        public int? SupplierId { get; set; }

        public int? ProductTypeId { get; set; }

        public int? DiscountId { get; set; }

        public string ProductName { get; set; } = null!;

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public string? Unit { get; set; }

        public string? Manufacturer { get; set; }

        public bool? IsNew { get; set; }

        public string? SpecialNote { get; set; }

        public string? ProductImage { get; set; }

        public DateTime? CreateAt { get; set; }

        public string? CreatedBy { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
