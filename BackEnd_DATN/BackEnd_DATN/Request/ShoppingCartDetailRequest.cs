namespace BackEnd_DATN.Request
{
    public class ShoppingCartDetailRequest
    {
        public int CartId { get; set; }

        public int ProductId { get; set; }

        public int Quantity { get; set; }
    }
}
