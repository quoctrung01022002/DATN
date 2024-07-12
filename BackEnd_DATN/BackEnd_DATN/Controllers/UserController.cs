using BackEnd_DATN.Entities;
using BackEnd_DATN.Enums;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Models;
using BackEnd_DATN.Request;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatnTrung62132908Context _context;
        private readonly MailSetting _mailSettings;
        private readonly AppSetting _appSetting;

        public UserController(DatnTrung62132908Context context, IOptions<MailSetting> mailSettings, IOptionsMonitor<AppSetting> optionsMonitor)
        {
            _context = context;
            _mailSettings = mailSettings.Value;
            _appSetting = optionsMonitor.CurrentValue;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserResgisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Please provide an email.");
            }

            // Kiểm tra xem email có tồn tại trong Gmail hay không
            bool emailExistsInGmail = await CheckEmailExistsInGmail(request.Email);
            if (!emailExistsInGmail)
            {
                return BadRequest("Email does not exist in Gmail.");
            }

            // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu hay chưa
            bool emailExistsInDatabase = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (emailExistsInDatabase)
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser.CodeOtp == null)
                {
                    int newOtp = GenerateOtp();
                    existingUser.CodeOtp = newOtp;
                    existingUser.ResetTokenExpires = DateTime.Now.AddMinutes(5);
                    await _context.SaveChangesAsync();
                    await SendOtpEmailAsync(request.Email, newOtp);
                    return Ok("New OTP generated and sent to your email. Please check your inbox.");
                }
                else
                {
                    return BadRequest("Email is already registered. Please proceed with OTP verification.");
                }
            }
            else
            {
                CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
                int newOtp = GenerateOtp();
                var newUser = new User
                {
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    CodeOtp = newOtp,
                    ResetTokenExpires = DateTime.Now.AddMinutes(5), 
                    RegistrationDate = DateTime.UtcNow,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    Address = request.Address,
                    Gender = request.Gender,
                    Cccd = request.Cccd,
                    RoleName = "Customer"
                };
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                await SendOtpEmailAsync(request.Email, newOtp);
                return Ok("User successfully created! Please check your email for the OTP.");
            }
        }

        private async Task<bool> CheckEmailExistsInGmail(string email)
        {
            return true;
        }

        [HttpGet("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Please provide an email.");
            }

            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("Email not found in the database.");
            }

            // Nếu email tồn tại, sinh mã OTP mới
            int otp = GenerateOtp();

            // Lưu mã OTP vào cơ sở dữ liệu và đặt thời gian hết hạn
            user.CodeOtp = otp;
            user.ResetTokenExpires = DateTime.Now.AddMinutes(5); // OTP hết hạn sau 5 phút

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Gửi mã OTP qua email
            await SendOtpEmailAsync(email, otp);

            

            return Ok("OTP sent to your email. Please check your inbox.");
        }



        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // Kiểm tra xem mật khẩu, mật khẩu xác nhận và OTP đã được cung cấp chưa
            if (string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.ConfirmPassword) || request.Otp == 0)
            {
                return BadRequest("Please provide password, confirm password, and OTP.");
            }

            // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có khớp nhau không
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Password and confirm password do not match.");
            }

            // Kiểm tra xem OTP đã hết hạn chưa và có khớp với OTP nào trong database không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email && u.CodeOtp == request.Otp && u.ResetTokenExpires > DateTime.Now);
            if (user == null)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            // Kiểm tra xem thời hạn của OTP đã hết hạn chưa
            if (user.ResetTokenExpires <= DateTime.Now)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            // Sinh mới hash và salt cho mật khẩu
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // Cập nhật hash mật khẩu mới và xóa OTP
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.CodeOtp = null; // Xóa OTP sau khi thiết lập lại mật khẩu
            user.ResetTokenExpires = null; // Xóa hạn của OTP
            await _context.SaveChangesAsync();

            return Ok("Password successfully reset.");
        }


        [HttpPost("verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyRequest request)
        {
            // Kiểm tra mã OTP có được cung cấp không
            if (request == null || request.Otp == 0)
            {
                return BadRequest("Please provide a valid OTP.");
            }

            // Truy vấn người dùng tương ứng với mã OTP
            var user = await _context.Users.FirstOrDefaultAsync(u => u.CodeOtp == request.Otp);
            if (user == null)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            // Kiểm tra xem mã OTP đã hết hạn chưa
            if (user.ResetTokenExpires <= DateTime.Now)
            {
                return BadRequest("Invalid or expired OTP.");
            }

            // Xác minh người dùng bằng cách cập nhật VerifiedAt
            user.VerifiedAt = DateTime.Now;
            user.CodeOtp = null; // Xóa OTP sau khi xác minh thành công
            await _context.SaveChangesAsync();

            return Ok("User verified successfully! You can now continue registration.");
        }
        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp(ResendOtpRequest resend)
        {
            // Kiểm tra email trước khi thực hiện
            if (string.IsNullOrEmpty(resend.Email))
            {
                return BadRequest("Please provide an email.");
            }

            // Kiểm tra xem email có tồn tại trong cơ sở dữ liệu không
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resend.Email);
            if (user == null)
            {
                return NotFound("Email not found in the database.");
            }

            // Nếu email tồn tại, sinh mã OTP mới
            int otp = GenerateOtp();

            // Lưu mã OTP vào cơ sở dữ liệu và đặt thời gian hết hạn
            user.CodeOtp = otp;
            user.ResetTokenExpires = DateTime.Now.AddMinutes(5); // OTP hết hạn sau 5 phút

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Gửi mã OTP qua email
            await SendOtpEmailAsync(resend.Email, otp);

            return Ok("New OTP sent to your email. Please check your inbox.");
        }




        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginRequest model)
        {
            try
            {
                // Kiểm tra request có email hay không
                if (string.IsNullOrEmpty(model.Email))
                {
                    return BadRequest("Please provide an email.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user == null || !VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email/password"
                    });
                }

                // Kiểm tra xem người dùng đã xác minh OTP thành công chưa
                if (user.RoleName == "Customer" && user.VerifiedAt == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Please verify OTP first."
                    });
                }

                var token = await GeneratedToken(user);
                //setTokenCookie(token.RefreshToken);
               return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Authentication successful",
                    Data = new
                    {
                        AccessToken = token.AccessToken,
                        RefreshToken = token.RefreshToken,
                        RoleName = user.RoleName
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("Login1")]
        public async Task<IActionResult> Login1(UserLoginRequest model)
        {
            try
            {
                // Kiểm tra request có email hay không
                if (string.IsNullOrEmpty(model.Email))
                {
                    return BadRequest("Please provide an email.");
                }

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
                if (user == null || !VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email/password"
                    });
                }

                // Kiểm tra xem người dùng đã xác minh OTP thành công chưa
                if (user.VerifiedAt == null && user.RoleName != "Admin" && user.RoleName != "Accountant" && user.RoleName != "Support" && user.RoleName != "Shipper")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Please verify OTP first."
                    });
                }

                // Kiểm tra vai trò của người dùng
                if (user.RoleName != "Admin" && user.RoleName != "Accountant" && user.RoleName != "Support" && user.RoleName != "Shipper")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "You do not have permission to log in."
                    });
                }

                var token = await GeneratedToken(user);

                // Trả về phản hồi thành công với dữ liệu bổ sung RoleName
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Authentication successful",
                    Data = new
                    {
                        AccessToken = token.AccessToken,
                        RefreshToken = token.RefreshToken,
                        RoleName = user.RoleName
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }




        [HttpPost("RenewToken")]
        public async Task<IActionResult> RenewToken(RenewTokenRequest request)
        {
            try
            {
                // Kiểm tra tính hợp lệ của refreshToken
                if (string.IsNullOrEmpty(request.RefreshToken))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Refresh token not found"
                    });
                }

                // Kiểm tra tính hợp lệ của refreshToken trong cơ sở dữ liệu
                var storedToken = await _context.RefreshTokens
                    .Where(x => x.Token == request.RefreshToken && !x.IsRevoked && !x.IsAccount && x.ExpireAt > DateTime.Now)
                    .FirstOrDefaultAsync();

                if (storedToken == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid refresh token"
                    });
                }

                // Kiểm tra tính hợp lệ của người dùng
                var user = await _context.Users.SingleOrDefaultAsync(a => a.UserId == storedToken.UserId);
                if (user == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "User not found"
                    });
                }

                // Tạo mới AccessToken và RefreshToken
                var newToken = await GeneratedToken(user);

                // Đánh dấu refreshToken đã được sử dụng và lưu vào cơ sở dữ liệu
                storedToken.IsAccount = true;
                storedToken.IsRevoked = true;

                _context.Update(storedToken);
                await _context.SaveChangesAsync();

                // Trả về kết quả thành công cùng với AccessToken và RefreshToken mới
                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Token renewed successfully",
                    Data = newToken.RefreshToken
                });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi và trả về thông báo lỗi tổng quát
                Console.WriteLine($"RenewToken failed: {ex.Message}");
                return BadRequest(new ApiResponse
                {
                    Success = false,
                    Message = "Something went wrong"
                });
            }
        }





        // Helper method to send OTP email
        private async Task SendOtpEmailAsync(string email, int otp)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(_mailSettings.SenderEmail);
                    mailMessage.To.Add(email);
                    mailMessage.Subject = "OTP của bạn";
                    mailMessage.Body = $"OTP của bạn là: {otp}. Vui lòng sử dụng mã này trong vòng 5 phút.";

                    client.Host = _mailSettings.Server;
                    client.Port = _mailSettings.Port;
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(_mailSettings.UserName, _mailSettings.Password);

                    await client.SendMailAsync(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Handle the exception
                Console.WriteLine($"Failed to send OTP email: {ex.Message}");
            }
        }



        // Helper methods for password hashing and token generation
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private int GenerateOtp()
        {
            Random rand = new Random();
            return rand.Next(100000, 999999);
        }

        private DateTime ConvertUnitTimeToDateTime(long utcExpireDate)
        {
            DateTime datetimeInterval = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return datetimeInterval.AddSeconds(utcExpireDate).ToUniversalTime();
        }

        // Implement GeneratedToken method
        private async Task<TokenModel> GeneratedToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(_appSetting.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {   
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim("userId", user.UserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(ClaimTypes.Role, user.RoleName)
                }),
                IssuedAt = DateTime.UtcNow,
                Expires = DateTime.UtcNow.AddMinutes(100),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);

            var refreshToken = CreateRandomToken();
            var refreshTokenEntity = new RefreshToken
            {
                Id = Guid.NewGuid(),
                JwtId = token.Id,
                Token = refreshToken,
                IsAccount = false,
                IsRevoked = false,
                IssueAt = DateTime.UtcNow,
                ExpireAt = DateTime.UtcNow.AddMinutes(1),
                UserId = user.UserId
            };

            await _context.RefreshTokens.AddAsync(refreshTokenEntity);
            await _context.SaveChangesAsync();

            return new TokenModel
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }


        private string CreateRandomToken(int byteLength = 32)
        {
            byte[] randomBytes = new byte[byteLength];

            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(randomBytes);
            }

            return Convert.ToBase64String(randomBytes);
        }
        private void setTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }

    }
}
