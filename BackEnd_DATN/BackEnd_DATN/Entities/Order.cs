using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Order
{
    public int OrderId { get; set; }

    public int? UserId { get; set; }

    public DateTime OrderDate { get; set; }

    public string? PaymentMethod { get; set; }

    public int? Status { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Address { get; set; }

    public string? Name { get; set; }

    public string? PhoneNumber { get; set; }

    public bool? Gender { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<Shipper> Shippers { get; set; } = new List<Shipper>();

    public virtual User? User { get; set; }
}
