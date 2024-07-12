using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd_DATN.Reponse
{
    public class UserResponse
    {
        public int UserId { get; set; }

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? PhoneNumber { get; set; }

        public string? Address { get; set; }

        public bool? Gender { get; set; }

        public string? Cccd { get; set; }

        public string? ImageUser { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }
    }
}
