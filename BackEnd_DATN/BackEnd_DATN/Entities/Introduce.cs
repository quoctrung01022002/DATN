using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Introduce
{
    public int IntroduceId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; }
}
