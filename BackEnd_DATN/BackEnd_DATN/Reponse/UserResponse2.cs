namespace BackEnd_DATN.Reponse
{
    public class UserResponse2
    {
        public int UserId { get; set; }

        public string Email { get; set; } = null!;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public bool? Gender { get; set; }

        public string? Cccd { get; set; }

        public string? RoleName { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string? ImageUser { get; set; }

        public int? WarningCount { get; set; }
    }
}
