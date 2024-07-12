namespace BackEnd_DATN.Models
{
    public class OrderModel1
    {
        public int OrderId { get; set; }
        public string? ProductImage { get; set; }

        public string? ProductName { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }
    }
}
