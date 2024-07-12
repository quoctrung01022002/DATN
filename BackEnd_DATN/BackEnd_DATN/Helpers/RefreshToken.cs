using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BackEnd_DATN.Entities;

namespace BackEnd_DATN.Helpers
{
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; }

        public int UserId { get; set; } // Sửa lại tên thuộc tính này thành NguoiDungId để phản ánh đúng tên của khóa ngoại

        [ForeignKey(nameof(UserId))]
        public User User { get; set; } // Sửa lại tên của thuộc tính này thành NguoiDung để phản ánh đúng quan hệ

        public string Token { get; set; }
        public string JwtId { get; set; }
        public bool IsAccount { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime IssueAt { get; set; }
        public DateTime ExpireAt { get; set; }
    }
}
