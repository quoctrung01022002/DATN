using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Settings;
using VnPay.Demo.Services;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Repositories;
using BackEnd_DATN.Services;
using Microsoft.Extensions.FileProviders;
using BackEnd_DATN.BackgroundServices;
using BackEnd_DATN.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DatnTrung62132908Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHttpContextAccessor();

builder.Services.AddSignalR();

builder.Services.Configure<VNPaySetting>(builder.Configuration.GetSection("VNPay"));
builder.Services.AddHttpContextAccessor();

// Repositories and Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductTypeRepository, ProductTypeRepository>();
builder.Services.AddScoped<IProductTypeService, ProductTypeService>();
builder.Services.AddScoped<IVNPayService, VNPayService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IBannerRepository, BannerRepository>();
builder.Services.AddScoped<IBannerService, BannerService>();
builder.Services.AddScoped<IProductImageDeatailRepository, ProductImageDetailRepository>();
builder.Services.AddScoped<IProductImageDetailService, ProductImageDetailService>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IDiscountRepository, DiscountRepository>(); 
builder.Services.AddScoped<IDiscountService, DiscountService>();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IShippingRepository, ShippingRepository>();
builder.Services.AddScoped<IIntroduceRepository, IntroduceRepository>();

builder.Services.AddHostedService<DeleteExpireOrderService>();

// Add controllers
builder.Services.AddControllers();

// Configure MailSettings
builder.Services.Configure<MailSetting>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddSingleton(builder.Configuration.GetSection("MailSettings").Get<MailSetting>());
builder.Services.AddHttpContextAccessor();
// Add authentication
builder.Services.Configure<AppSetting>(builder.Configuration.GetSection("AppSettings"));
var secretKey = builder.Configuration["AppSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    Console.WriteLine("Error: SecretKey is null or empty.");
    secretKey = "defaultSecretKey";
}
var secretKeyBytes = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(secretKeyBytes),
            ClockSkew = TimeSpan.Zero,
        };
    });

// Add Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyAllowSpecificOrigins",
     policy =>
     {
         policy.WithOrigins("http://127.0.0.1:5173")
             .AllowAnyHeader()
             .AllowAnyMethod()
            .AllowCredentials();
     });
});

// Add Swagger
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPI", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}

// Configure wwwroot/uploads directory
var uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
if (!Directory.Exists(uploadsDirectory))
{
    Directory.CreateDirectory(uploadsDirectory);
}

// Serve static files from wwwroot/uploads directory
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDirectory),
    RequestPath = "/uploads"
});
app.UseHttpsRedirection();

// Add Cors
app.UseCors("MyAllowSpecificOrigins");

// Add custom error handling middleware
app.UseExceptionHandler("/error");

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<JwtMiddleware>();
app.MapControllers();

// Add SignalR hub endpoint
app.MapHub<AdminHub>("/chatHub");

app.Run();
