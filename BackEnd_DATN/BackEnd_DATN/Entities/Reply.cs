using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class Reply
{
    public int ReplyId { get; set; }

    public int CommentId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime ReplyDate { get; set; }

    public virtual Comment Comment { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
