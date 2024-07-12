namespace BackEnd_DATN.Reponse
{
    public class ProductReponse
    {

        public int ProductId { get; set; }

        public string? ProductName { get; set; }

        public decimal? Price { get; set; }

        public int Quantity { get; set; }

        public string? Unit { get; set; }

        public string? Manufacturer { get; set; }

        public bool? IsNew { get; set; }

        public string? SpecialNote { get; set; }

        public string? ProductImage { get; set; }

        public decimal? DiscountValue { get; set; }
    }
}
