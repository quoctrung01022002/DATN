using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class ProductImageDetail
{
    public int ProductImageId { get; set; }

    public int? ProductId { get; set; }

    public string? ImageUrl { get; set; }

    public int Position { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string? UpdateBy { get; set; }

    public virtual Product? Product { get; set; }
}
