using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly DatnTrung62132908Context _context;
    private readonly ILogger<ProductController> _logger;

    public ProductController(DatnTrung62132908Context context, ILogger<ProductController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("GetCart")]
    public async Task<IActionResult> GetCart()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var isValid = int.TryParse(userIdClaim, out int userId);

        if (!isValid)
        {
            return Unauthorized();
        }

        var cartDetails = await (from scd in _context.ShoppingCartDetails
                                 join p in _context.Products on scd.ProductId equals p.ProductId
                                 where scd.Cart.UserId == userId // Lọc theo UserId
                                 select new ShoppingCartDetail()
                                 {
                                     Product = new Product
                                     {
                                         ProductId = p.ProductId,
                                         ProductName = p.ProductName,
                                         Discount = p.Discount,
                                         Price = p.Price,
                                         ProductImage = p.ProductImage,
                                         Quantity = p.Quantity
                                     },
                                     Quantity = scd.Quantity,
                                 }).ToListAsync();
        //var distinctProductCount = cartDetails.Select(detail => detail.Product.ProductId).Distinct().Count();

        return Ok(cartDetails);
    }
    [HttpGet("CountUniqueProducts")]
    public async Task<IActionResult> CountUniqueProducts()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;

        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        var isValid = int.TryParse(userIdClaim, out int userId);

        if (!isValid)
        {
            return Unauthorized();
        }

        var uniqueProductCount = await _context.ShoppingCartDetails
            .Where(scd => scd.Cart.UserId == userId)
            .Select(scd => scd.ProductId)
            .Distinct()
            .CountAsync();

        return Ok(uniqueProductCount);
    }


    // API endpoint để thêm sản phẩm vào giỏ hàng
    [HttpPost("AddToCart")]
    public async Task<IActionResult> AddToCart(AddToCartRequest request)
    {
        try
        {
            // Tìm giỏ hàng của người dùng
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var isValid = int.TryParse(userIdClaim, out int userId);

            if (!isValid)
            {
                return Unauthorized();
            }

            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            // Nếu không tìm thấy giỏ hàng, tạo mới
            if (cart == null)
            {
                cart = new ShoppingCart
                {
                    UserId = userId,
                    CreatedDate = DateTime.Now,
                    LastUpdatedDate = DateTime.Now,
                };
                _context.ShoppingCarts.Add(cart);
            }

            // Lấy thông tin sản phẩm
            var product = await _context.Products.FindAsync(request.ProductId);

            if (product == null)
            {
                return NotFound("Product not found");
            }

            // Kiểm tra số lượng sản phẩm có đủ trong kho không
            if (product.Quantity < request.Quantity)
            {
                return StatusCode(403, "Not enough quantity in stock");

            }
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            var cartDetail = cart.ShoppingCartDetails.FirstOrDefault(d => d.ProductId == request.ProductId);
            if (cartDetail == null)
            {
                // Nếu chưa tồn tại, tạo mới
                cartDetail = new ShoppingCartDetail
                {
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                };
                cart.ShoppingCartDetails.Add(cartDetail);
            }
            else
            {
                // Nếu đã tồn tại, kiểm tra xem tổng số lượng trong giỏ hàng và kho có vượt quá không
                if (cartDetail.Quantity + request.Quantity > product.Quantity)
                {
                    return StatusCode(402, "Not enough quantity in stock");
                }

                // Cập nhật số lượng
                cartDetail.Quantity += request.Quantity;
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
            return Ok("Product added to cart successfully");
        }
        catch (Exception ex)
        {
            // Trả về lỗi nếu có vấn đề xảy ra
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }


    // API endpoint để xóa sản phẩm khỏi giỏ hàng
    [HttpDelete("DeleteCartItem/{productId}")]
    public async Task<IActionResult> DeleteCartItem(int productId)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            /*var userIdClaim = "1";*/ // Thay đổi userIdClaim theo cách bạn lấy userId

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var isValid = int.TryParse(userIdClaim, out int userId);

            if (!isValid)
            {
                return Unauthorized();
            }

            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return BadRequest("Cart not found");
            }

            var cartDetail = cart.ShoppingCartDetails.FirstOrDefault(d => d.ProductId == productId);
            if (cartDetail != null)
            {
                _context.ShoppingCartDetails.Remove(cartDetail);
                await _context.SaveChangesAsync();
                return Ok("Product removed from cart successfully");
            }
            else
            {
                return BadRequest("Product not found in cart");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpPut("EditCartItem")]
    public async Task<IActionResult> EditCartItem(AddToCartRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return BadRequest("Cart not found");
            }

            var cartDetail = cart.ShoppingCartDetails.FirstOrDefault(d => d.ProductId == request.ProductId);
            if (cartDetail == null)
            {
                return BadRequest("Product not found in cart");
            }

            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return NotFound("Product not found");
            }

            // Kiểm tra số lượng sản phẩm trong kho
            if (request.Quantity > product.Quantity)
            {
                return BadRequest("Requested quantity exceeds available stock");
            }

            // Kiểm tra số lượng sản phẩm trong giỏ hàng sau khi chỉnh sửa
            if (request.Quantity < 0 && Math.Abs(request.Quantity) > cartDetail.Quantity)
            {
                return BadRequest("Invalid quantity");
            }

            cartDetail.Quantity = request.Quantity;
            await _context.SaveChangesAsync();
            return Ok("Cart item updated successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }




    // API endpoint để xóa tất cả sản phẩm trong giỏ hàng
    [HttpDelete("ClearCart")]
    public async Task<IActionResult> ClearCart()
    {
        try
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            /*var userIdClaim = "1";*/ // Thay đổi userIdClaim theo cách bạn lấy userId

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var isValid = int.TryParse(userIdClaim, out int userId);

            if (!isValid)
            {
                return Unauthorized();
            }

            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartDetails)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return BadRequest("Cart not found");
            }

            _context.ShoppingCartDetails.RemoveRange(cart.ShoppingCartDetails);
            await _context.SaveChangesAsync();

            return Ok("Cart cleared successfully");
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

}
