using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Supplier
{
    public int SupplierId { get; set; }

    public string SupplierName { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? ContactPerson { get; set; }

    public string? ContactEmail { get; set; }

    public DateTime? CreateAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string? UpdateBy { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
