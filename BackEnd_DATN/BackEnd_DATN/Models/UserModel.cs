using BackEnd_DATN.Enums;

namespace BackEnd_DATN.Models
{
    public class UserModel
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

        public string? CCCD { get; set; }

        public string? RoleName { get; set; }

        //public string? ProfileImage { get; set; }

    }
}
