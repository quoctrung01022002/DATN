using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Brand
{
    public int BrandId { get; set; }

    public string? CountryOfOrigin { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
