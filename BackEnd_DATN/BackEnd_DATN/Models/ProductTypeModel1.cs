namespace BackEnd_DATN.Models
{
    public class ProductTypeModel1
    {
        public int ProductTypeId { get; set; }

        public string ProductTypeName { get; set; } = null!;

        public string? Description { get; set; }

        public DateTime? UpdateAt { get; set; }

        public string? UpdateBy { get; set; }
    }
}
