namespace BackEnd_DATN.Models
{
    public partial class DiscountModel
    {
        public int DiscountId { get; set; }

        public decimal DiscountValue { get; set; }

        public DateTime? CreateAt { get; set; }

        public string? CreatedBy { get; set; }
    }
}
