using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Comment
{
    public int CommentId { get; set; }

    public int? ProductId { get; set; }

    public int? UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CommentDate { get; set; }

    public int? StarRating { get; set; }

    public virtual Product? Product { get; set; }

    public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();

    public virtual User? User { get; set; }
}
