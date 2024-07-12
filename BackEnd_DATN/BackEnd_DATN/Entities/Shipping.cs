using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Shipping
{
    public int ShippingId { get; set; }

    public decimal? ShippingUnitPrice { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
