namespace BackEnd_DATN.Models
{
    public partial class ShoppingCartModel
    {
        public int CartId { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? LastUpdatedDate { get; set; }

        public bool? IsCheckedOut { get; set; }
    }
}
