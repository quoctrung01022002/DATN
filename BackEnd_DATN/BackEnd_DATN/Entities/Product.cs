using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Product
{
    public int ProductId { get; set; }

    public int? BrandId { get; set; }

    public int? ProductTypeId { get; set; }

    public int? DiscountId { get; set; }

    public int? UserId { get; set; }

    public string? ProductName { get; set; }

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public string? Unit { get; set; }

    public string? Manufacturer { get; set; }

    public bool? IsNew { get; set; }

    public string? SpecialNote { get; set; }

    public string? ProductImage { get; set; }

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public int? SupplierId { get; set; }

    public virtual Brand? Brand { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual Discount? Discount { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<ProductImageDetail> ProductImageDetails { get; set; } = new List<ProductImageDetail>();

    public virtual ProductType? ProductType { get; set; }

    public virtual ICollection<ShoppingCartDetail> ShoppingCartDetails { get; set; } = new List<ShoppingCartDetail>();

    public virtual Supplier? Supplier { get; set; }

    public virtual User? User { get; set; }
}
