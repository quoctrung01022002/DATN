using BackEnd_DATN.Models;

namespace BackEnd_DATN.Request
{
    public class OrderRequest
    {
        public List<ShoppingCartDetailModel> CartItems  { get; set; }
       
        public decimal SelectedTotalPrice { get; set; }
        public string ReturnUrl { get; set; }


    }
}
