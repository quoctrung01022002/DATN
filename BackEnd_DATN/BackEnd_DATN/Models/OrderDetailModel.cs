namespace BackEnd_DATN.Models
{
    public class OrderDetailModel
    {
        public int OrderId { get; set; }

        public int ProductId { get; set; }

        public string? ProductImage { get; set; }

        public string ProductName { get; set; } = null!;

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public double DiscountValue { get; set; }
    }
}
