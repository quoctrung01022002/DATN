using System.ComponentModel.DataAnnotations;

namespace BackEnd_DATN.Request
{
    public class VerifyRequest
    {
        [Required]
        public int Otp { get; set; }
    }
}
