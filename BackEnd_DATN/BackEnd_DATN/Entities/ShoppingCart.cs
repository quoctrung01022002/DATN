using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class ShoppingCart
{
    public int CartId { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? LastUpdatedDate { get; set; }

    public bool? IsCheckedOut { get; set; }

    public virtual ICollection<ShoppingCartDetail> ShoppingCartDetails { get; set; } = new List<ShoppingCartDetail>();

    public virtual User? User { get; set; }
}
