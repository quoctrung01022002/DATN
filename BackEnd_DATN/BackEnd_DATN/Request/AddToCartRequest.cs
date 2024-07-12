namespace BackEnd_DATN.Request
{
    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        public int DiscountId { get; set; }
    }
}
