﻿using System.ComponentModel.DataAnnotations;
namespace BackEnd_DATN.Request
{
    public class ResendOtpRequest
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;
    }
}
