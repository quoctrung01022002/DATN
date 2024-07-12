using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class WarningLog
{
    public int WarningLogId { get; set; }

    public int UserId { get; set; }

    public DateTime WarningTime { get; set; }

    public int? WarningCount { get; set; }

    public virtual User User { get; set; } = null!;
}
