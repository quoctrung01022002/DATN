namespace BackEnd_DATN.Models
{
    public class ProductModel3
    {
        public int ProductId { get; set; }

        public int? ProductTypeId { get; set; }

        public int? DiscountId { get; set; }

        public string? ProductName { get; set; }

        public decimal? Price { get; set; }

        public int Quantity { get; set; }

        public string? Description { get; set; }

        public string? Unit { get; set; }

        public string? Manufacturer { get; set; }

        public bool? IsNew { get; set; }

        public string? SpecialNote { get; set; }

        public string? ProductImage { get; set; }

        public decimal? DiscountValue { get; set; }

        public string? CountryOfOrigin { get; set; }

        public List<ProductImageDetailModel> ProductImageDetails { get; set; }

        public ProductModel3()
        {
            ProductImageDetails = new List<ProductImageDetailModel>();
        }
    }
}
