namespace BackEnd_DATN.Models
{
    public class ShoppingCartDetailModel
    {
        public int CartId { get; set; }

        public int DiscountId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

    }
}
