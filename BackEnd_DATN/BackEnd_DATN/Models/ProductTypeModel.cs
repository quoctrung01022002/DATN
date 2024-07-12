namespace BackEnd_DATN.Models
{
    public partial class ProductTypeModel
    {
        public int ProductTypeId { get; set; }

        public string ProductTypeName { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime? CreateAt { get; set; }

        public string? CreatedBy { get; set; }
    }
}
