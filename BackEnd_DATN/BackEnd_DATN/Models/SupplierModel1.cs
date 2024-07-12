namespace BackEnd_DATN.Models
{
    public class SupplierModel1
    {
        public int SupplierId { get; set; }

        public string SupplierName { get; set; } = null!;

        public string Address { get; set; } = null!;

        public string PhoneNumber { get; set; } = null!;

        public string? ContactPerson { get; set; }

        public string? ContactEmail { get; set; }

        public DateTime? UpdateAt { get; set; }

        public string? UpdateBy { get; set; }
    }
}
