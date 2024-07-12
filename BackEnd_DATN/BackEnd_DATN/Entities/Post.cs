using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Post
{
    public int PostId { get; set; }

    public int? UserId { get; set; }

    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public DateTime? CreateAt { get; set; }

    public DateTime? UpdateAt { get; set; }

    public string? ImageUrl { get; set; }

    public virtual User? User { get; set; }
}
