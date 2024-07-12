using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly AppSetting _appSettings;

        public JwtMiddleware(RequestDelegate next, IOptions<AppSetting> appSettings)
        {
            _next = next;
            _appSettings = appSettings.Value;
        }

        public async Task Invoke(HttpContext context, DatnTrung62132908Context dbContext)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            if (token != null)
                AttachUserToContext(context, dbContext, token);

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, DatnTrung62132908Context dbContext, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.SecretKey);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                // Attach user to context based on userId
                var user = dbContext.Users.FirstOrDefault(x => x.UserId == userId);
                if (user != null)
                {
                    context.Items["User"] = user;
                }
            }
            catch
            {
                // Do nothing if JWT validation fails
                // User is not attached to context so request won't have access to secure routes
            }
        }
    }
}
