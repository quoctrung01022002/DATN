using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class ShoppingCartDetail
{
    public int CartId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public virtual ShoppingCart Cart { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
