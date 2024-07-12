using BackEnd_DATN.Entities;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Request;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BackEnd_DATN.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IWebHostEnvironment _env;
        private readonly MailSetting _mailSettings;
        public UserRepository(DatnTrung62132908Context context, IWebHostEnvironment env, MailSetting mailSettings)
        {
            _context = context;
            _env = env;
            _mailSettings = mailSettings;
        }

        public async Task<bool> IsGmailAddress(string email)
        {
            try
            {
                var host = new System.Net.Mail.MailAddress(email).Host;
                return host.Equals("gmail.com", StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        public async Task Create(UserModel1 user)
        {
            try
            {
                // Kiểm tra xem email có thuộc Gmail hay không
                if (!await IsGmailAddress(user.Email))
                {
                    throw new Exception("Email không thuộc Gmail.");
                }

                string fileName = null;

                if (user.ImageFile != null && user.ImageFile.Length > 0)
                {
                    // Get file name
                    fileName = Guid.NewGuid().ToString() + Path.GetExtension(user.ImageFile.FileName);
                    // File path to store the image in wwwroot/uploads
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Store file in wwwroot/uploads directory
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await user.ImageFile.CopyToAsync(stream);
                    }

                    // Assign the image path to ImageUser
                    user.ImageUser = "/uploads/" + fileName;
                }

                // Create password hash
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

                // Convert UserModel1 to User and save it to the database
                var newUser = new User
                {
                    Email = user.Email,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    RegistrationDate = DateTime.UtcNow,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    Gender = user.Gender,
                    Cccd = user.CCCD,
                    RoleName = user.RoleName,
                    ImageUser = user.ImageUser
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                // Send password email
                await SendPasswordEmailAsync(newUser.Email, Encoding.UTF8.GetBytes(user.Password));
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while creating user.", ex);
            }
        }



        // Helper method to create password hash
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); // Chuyển đổi chuỗi sang mảng byte
            }
        }

        // Helper method to send password email
        private async Task SendPasswordEmailAsync(string email, byte[] passwordHash)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    var mailMessage = new MailMessage();
                    mailMessage.From = new MailAddress(_mailSettings.SenderEmail);
                    mailMessage.To.Add(email);
                    mailMessage.Subject = "Mật khẩu đăng ký của bạn";
                    mailMessage.Body = $"Mật khẩu đăng ký của bạn là: {Encoding.UTF8.GetString(passwordHash)}. Xin vui lòng giữ nó an toàn.";

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
                Console.WriteLine($"Failed to send password email: {ex.Message}");
            }
        }




        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<IEnumerable<UserResponse2>> GetAllCustomer()
        {
            var customers = await (from u in _context.Users
                                   join n in _context.WarningLogs on u.UserId equals n.UserId into warningLogs
                                   from n in warningLogs.DefaultIfEmpty() 
                                   where u.RoleName == "Customer"
                                   select new UserResponse2
                                   {
                                       UserId = u.UserId,
                                       Email = u.Email,
                                       ImageUser = u.ImageUser,
                                       FirstName = u.FirstName,
                                       LastName = u.LastName,
                                       PhoneNumber = u.PhoneNumber,
                                       Address = u.Address,
                                       Gender = u.Gender,
                                       Cccd = u.Cccd,
                                       RoleName = u.RoleName,
                                       RegistrationDate = u.RegistrationDate,
                                       WarningCount = n != null ? n.WarningCount : 0
                                   }).ToListAsync();

            return customers;
        }




        public async Task<IEnumerable<User>> GetAllStaff()
        {
            return await _context.Users
                .Where(x => x.RoleName != "Customer")
                .Select(x => new User
                {
                    UserId = x.UserId,
                    Email = x.Email,
                    ImageUser = x.ImageUser,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    PhoneNumber = x.PhoneNumber,
                    Address = x.Address,
                    Gender = x.Gender,
                    Cccd = x.Cccd,
                    RoleName = x.RoleName,
                    RegistrationDate = x.RegistrationDate,
                }).ToListAsync();
        }


        public async Task<UserResponse1> GetById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                return new UserResponse1
                {
                    UserId = user.UserId,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    Gender = user.Gender,
                    Cccd = user.Cccd,
                    ImageUser = user.ImageUser,
                    RoleName = user.RoleName,
                };
            }
            return null;
        }

        public async Task<IEnumerable<UserRequest>> Search(string keyword)
        {
            // Tìm kiếm user theo từ khóa
            var users = await _context.Users
                .Where(u => u.FirstName.Contains(keyword) || u.LastName.Contains(keyword) || u.Email.Contains(keyword))
                .Select(x => new UserRequest
                {
                    UserId = x.UserId,
                    Email = x.Email,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    PhoneNumber = x.PhoneNumber,
                    Address = x.Address,
                    Gender = x.Gender,
                    Cccd = x.Cccd,
                    RoleName = x.RoleName,
                }).ToListAsync();

            return users;
        }

        public async Task<User> Update(int id, UserResponse user)
        {
            var existingUser = await _context.Users.FindAsync(id);

            if (existingUser == null)
            {
                throw new InvalidOperationException("User not found");
            }

            try
            {
                // Store the current user image path
                string currentUserImagePath = existingUser.ImageUser;

                // Handle file upload if a new image is provided
                if (user.ImageFile != null && user.ImageFile.Length > 0)
                {
                    // Generate new file name
                    string fileName = Guid.NewGuid().ToString() + Path.GetExtension(user.ImageFile.FileName);
                    var filePath = Path.Combine(_env.WebRootPath, "Uploads", fileName);

                    // Upload the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await user.ImageFile.CopyToAsync(stream);
                    }

                    // Update the user image path
                    existingUser.ImageUser = "/uploads/" + fileName;

                    // Delete the previous image file
                    if (!string.IsNullOrEmpty(currentUserImagePath))
                    {
                        var currentUserFilePath = Path.Combine(_env.WebRootPath, currentUserImagePath.TrimStart('/'));
                        if (File.Exists(currentUserFilePath))
                        {
                            File.Delete(currentUserFilePath);
                        }
                    }
                }

                // Update user properties
                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.Address = user.Address;
                existingUser.Gender = user.Gender;
                existingUser.Cccd = user.Cccd;

                // Update the existing user in the database
                _context.Users.Update(existingUser);
                await _context.SaveChangesAsync();

                return existingUser;
            }
            catch (Exception ex)
            {
                // Handle error
                throw new Exception("Error occurred while updating user.", ex);
            }
        }

        public async Task<WarningLog> UpdateWarningCount(int id, UserResponse3 user)
        {
            var existingUser = await _context.WarningLogs.FirstOrDefaultAsync(u => u.UserId == id);
            if (existingUser != null)
            {
                existingUser.WarningCount = user.WarningCount;
                await _context.SaveChangesAsync();
            }
            return existingUser;
        }
    }
}
