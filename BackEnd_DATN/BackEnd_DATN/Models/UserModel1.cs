using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Models
{
    public class UserModel1
    {
        public int? UserId { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = null!;     

        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Please enter at least 6 characters.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm password is required.")]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public bool? Gender { get; set; }

        public string? CCCD { get; set; }

        public string? RoleName { get; set; }

        public DateTime? RegistrationDate { get; set; }

        public string? ImageUser { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
