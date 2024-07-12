using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Discount
{
    public int DiscountId { get; set; }

    public decimal DiscountValue { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
