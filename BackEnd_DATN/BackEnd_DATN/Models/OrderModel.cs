namespace BackEnd_DATN.Models
{
    public class OrderModel
    {
        public int OrderId { get; set; }

        public int? UserId { get; set; }

        public string? Name { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public bool? Gender { get; set; }

        public DateTime OrderDate { get; set; }

        public string? PaymentMethod { get; set; }

        public int? Status { get; set; }

        public List<OrderDetailModel> OrderDetails { get; set; }
    }
}
