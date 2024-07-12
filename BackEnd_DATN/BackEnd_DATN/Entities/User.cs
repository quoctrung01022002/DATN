using BackEnd_DATN.Helpers;
using System;
using System.Collections.Generic;

namespace BackEnd_DATN.Entities;

public partial class User
{
    public int UserId { get; set; }

    public string Email { get; set; } = null!;

    public byte[] PasswordHash { get; set; } = null!;

    public byte[] PasswordSalt { get; set; } = null!;

    public string? VerificationToken { get; set; }

    public DateTime? VerifiedAt { get; set; }

    public string? PasswordResetToken { get; set; }

    public DateTime? ResetTokenExpires { get; set; }

    public int? CodeOtp { get; set; }

    public DateTime? OtpExpiration { get; set; }

    public DateTime RegistrationDate { get; set; }

    public DateTime? LastLogin { get; set; }

    public bool? IsBlocked { get; set; }

    public DateTime? BlockedTime { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Address { get; set; }

    public bool? Gender { get; set; }

    public string? Cccd { get; set; }

    public string? RoleName { get; set; }

    public string? ImageUser { get; set; }

    public bool IsLocked { get; set; }

    public DateTime? LockedAt { get; set; }

    public DateTime? LockedUntil { get; set; }

    public virtual ICollection<ChatMessage> ChatMessageReceivers { get; set; } = new List<ChatMessage>();

    public virtual ICollection<ChatMessage> ChatMessageSenders { get; set; } = new List<ChatMessage>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Post> Posts { get; set; } = new List<Post>();

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();

    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public virtual ICollection<Reply> Replies { get; set; } = new List<Reply>();

    public virtual ICollection<Shipper> Shippers { get; set; } = new List<Shipper>();

    public virtual ICollection<ShoppingCart> ShoppingCarts { get; set; } = new List<ShoppingCart>();

    public virtual ICollection<WarningLog> WarningLogs { get; set; } = new List<WarningLog>();
}
