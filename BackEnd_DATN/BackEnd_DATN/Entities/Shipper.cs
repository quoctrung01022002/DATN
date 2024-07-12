using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Shipper
{
    public int UserId { get; set; }

    public int OrderId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
