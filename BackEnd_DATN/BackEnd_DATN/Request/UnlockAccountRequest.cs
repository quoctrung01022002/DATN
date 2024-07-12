using System.ComponentModel.DataAnnotations;

namespace BackEnd_DATN.Request
{
    public class UnlockAccountRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;
    }
}
