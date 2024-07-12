using BackEnd_DATN.Entities;
using BackEnd_DATN.Helpers;
using BackEnd_DATN.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;
using VnPay.Demo.Services;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly DatnTrung62132908Context _context;
        private readonly IPaymentService _paymentService;

        // Injecting dependencies through constructor
        public OrderController(DatnTrung62132908Context context, IPaymentService paymentService)
        {
            _context = context;
            _paymentService = paymentService;
        }

        // Endpoint to create a new order
        [HttpPost("CreateOrder")]
        [Authorize]
        public async Task<IActionResult> CreateOrder(OrderRequest request)
        {
            try
            {
                // Lấy userId từ claims
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized();
                }

                // Tìm kiếm thông tin người dùng từ cơ sở dữ liệu
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }

                // Tạo một đơn hàng mới và gán thông tin người dùng
                var newOrder = new Order
                {
                    User = user,
                    OrderDate = DateTime.Now,
                    Status = 0,
                    PaymentMethod = "Online Payment",
                    Name = user.FirstName + " " + user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Gender = user.Gender,
                    Address = user.Address,
                };

                // Thêm đơn hàng vào context và lưu thay đổi
                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                // Tạo danh sách chi tiết đơn hàng
                var orderDetails = new List<OrderDetail>();
                foreach (var cartItem in request.CartItems)
                {
                    // Lấy thông tin sản phẩm và giảm giá (nếu có)
                    var product = await _context.Products.Include(p => p.Discount).FirstOrDefaultAsync(p => p.ProductId == cartItem.ProductId);

                    // Kiểm tra xem sản phẩm có tồn tại không
                    if (product == null)
                    {
                        return NotFound($"Product with ID {cartItem.ProductId} not found.");
                    }

                    // Tạo chi tiết đơn hàng mới
                    var orderDetail = new OrderDetail
                    {
                        Order = newOrder, // Liên kết với đơn hàng mới tạo
                        ProductId = cartItem.ProductId,
                        Quantity = cartItem.Quantity,
                        Price = product.Price,
                        DiscountValue = product.Discount != null && product.Discount.DiscountId != 13 ? product.Discount.DiscountValue : 0,
                    };

                    // Thêm chi tiết đơn hàng vào danh sách
                    orderDetails.Add(orderDetail);
                }

                // Thêm danh sách chi tiết đơn hàng vào context và lưu thay đổi
                _context.OrderDetails.AddRange(orderDetails);
                await _context.SaveChangesAsync();

                // Tạo URL thanh toán và trả về kết quả
                var result = _paymentService.CreateVNPayUrl(HttpContext, request.SelectedTotalPrice, request.ReturnUrl, newOrder.OrderId);
                return Ok(result.Value);
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về mã lỗi 500
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating order: {ex.Message}");
            }
        }



        [HttpGet("Confirm")]
        public IActionResult Confirm([FromQuery] IQueryCollection keyValuePairs)
        {
            var result = _paymentService.ExecuteVNPayPayment(keyValuePairs);
            if (result.IsSuccess)
            {
                return Ok();
            }
            return BadRequest();
        }



        // Endpoint to confirm payment
        [HttpGet("{vnp_TxnRef}")]
        public async Task<IActionResult> GetOrder(string vnp_TxnRef)
        {
            try
            {
                // Tìm đơn hàng bằng ID
                var order = await _context.Orders
                    .Include(o => o.User) // Bao gồm thông tin người dùng liên quan
                    .Include(o => o.OrderDetails) // Bao gồm chi tiết đơn hàng
                        .ThenInclude(od => od.Product) // Bao gồm thông tin sản phẩm cho mỗi chi tiết đơn hàng
                    .FirstOrDefaultAsync(o => o.OrderId.ToString() == vnp_TxnRef);

                if (order == null)
                    return NotFound("Đơn hàng không tồn tại");

                // Lấy chỉ các chi tiết đơn hàng của đơn hàng cụ thể
                var orderDetails = order.OrderDetails.ToList(); // Chuyển sang danh sách để tránh lỗi về deferred execution

                // Ánh xạ dữ liệu đơn hàng thành DTO
                var orderDto = new OrderModel
                {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        Name = order.Name,
                        PhoneNumber = order.PhoneNumber,
                        Address = order.Address,
                        Gender = order.Gender,
                        OrderDate = order.OrderDate,
                        PaymentMethod = order.PaymentMethod,
                        OrderDetails = await (from od in _context.OrderDetails
                                              join p in _context.Products on od.ProductId equals p.ProductId
                                              where od.OrderId == order.OrderId // Lọc theo OrderId
                                              select new OrderDetailModel
                                              {
                                                  OrderId = od.OrderId,
                                                  ProductId = od.ProductId,
                                                  ProductImage = p.ProductImage,
                                                  ProductName = p.ProductName,
                                                  Quantity = od.Quantity,
                                                  Price = p.Price,
                                                  DiscountValue = p.Discount == null ? 0.0 : (double)p.Discount.DiscountValue
                                              }).ToListAsync()

                };

                return Ok(orderDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi khi lấy chi tiết đơn hàng: {ex.Message}");
            }
        }
        // Endpoint to get all orders with selected fields
        [HttpGet("GetSelectedOrderFieldsWithShippers")]
        public async Task<IActionResult> GetSelectedOrderFieldsWithShippers()
        {
            try
            {
                var ordersWithShippers = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Shippers)
                        .ThenInclude(s => s.User)
                    .ToListAsync();

                var orderAndShippersList = ordersWithShippers.Select(order =>
                {
                    // Lấy thông tin Shipper đầu tiên của đơn hàng (giả sử mỗi đơn hàng chỉ có một người giao hàng)
                    var shipper = order.Shippers.FirstOrDefault();
                    var orderDto = new
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        Name = order.Name,                     
                        PhoneNumber = order.PhoneNumber,
                        ShipperUserId = shipper?.UserId,
                        ShipperFirstName = shipper?.User.FirstName,
                        ShipperLastName = shipper?.User.LastName,
                        Status = order.Status,
                        UpdatedAt = order.UpdatedAt
                    };
                    return orderDto;
                }).ToList();

                return Ok(orderAndShippersList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error getting orders with shippers: {ex.Message}");
            }
        }
        // Endpoint to get selected order fields with shippers by order ID
        [HttpGet("GetSelectedOrderFieldsWithShippers/{orderId}")]
        public async Task<IActionResult> GetSelectedOrderFieldsWithShippers(int orderId)
        {
            try
            {
                var orderWithShippers = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Shippers)
                        .ThenInclude(s => s.User)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                if (orderWithShippers == null)
                {
                    return NotFound($"Order with ID {orderId} not found.");
                }

                // Lấy thông tin Shipper đầu tiên của đơn hàng (giả sử mỗi đơn hàng chỉ có một người giao hàng)
                var shipper = orderWithShippers.Shippers.FirstOrDefault();
                var orderDto = new
                {
                    OrderId = orderWithShippers.OrderId,
                    UserId = orderWithShippers.UserId,
                    Name = orderWithShippers.Name,
                    PhoneNumber = orderWithShippers.PhoneNumber,
                    ShipperUserId = shipper?.UserId,
                    ShipperFirstName = shipper?.User.FirstName,
                    ShipperLastName = shipper?.User.LastName,
                    Status = orderWithShippers.Status,
                    UpdatedAt = orderWithShippers.UpdatedAt
                };

                return Ok(orderDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error getting order with shippers: {ex.Message}");
            }
        }
        [HttpGet("GetSelectedOrderFieldsWithShippersByUserId")]
        public async Task<IActionResult> GetSelectedOrderFieldsWithShippersByUserId()
        {
            try
            {
                // Lấy userId từ claim trong token
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

                // Tiếp tục thực hiện lấy dữ liệu orders
                var ordersWithShippers = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Shippers)
                        .ThenInclude(s => s.User)
                    .Where(o => o.UserId == userId && o.Status != 0)
                    .ToListAsync();

                if (ordersWithShippers == null || ordersWithShippers.Count == 0)
                {
                    return NotFound($"No orders found for user with ID {userId}");
                }

                var orderAndShippersList = ordersWithShippers.Select(order =>
                {
                    var shipper = order.Shippers.FirstOrDefault();
                    var orderDto = new
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        Name = order.Name,
                        PhoneNumber = order.PhoneNumber,
                        ShipperUserId = shipper?.UserId,
                        ShipperFirstName = shipper?.User.FirstName,
                        ShipperLastName = shipper?.User.LastName,
                        Status = order.Status,
                        UpdatedAt = order.UpdatedAt
                    };
                    return orderDto;
                }).ToList();

                return Ok(orderAndShippersList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error getting orders with shippers: {ex.Message}");
            }
        }




        // Endpoint to delete an order by order ID
        [HttpDelete("DeleteOrder/{orderId}")]
        public async Task<IActionResult> DeleteOrder(int orderId)
        {
            try
            {
                var orderToDelete = await _context.Orders.FindAsync(orderId);
                if (orderToDelete == null)
                {
                    return NotFound($"Order with ID {orderId} not found.");
                }

                // Xóa bản ghi từ bảng Orders
                _context.Orders.Remove(orderToDelete);

                // Tìm và xóa tất cả các bản ghi từ bảng OrderDetails có liên kết với bản ghi orderId
                var orderDetailsToDelete = await _context.OrderDetails.Where(od => od.OrderId == orderId).ToListAsync();
                _context.OrderDetails.RemoveRange(orderDetailsToDelete);

                // Tìm và xóa tất cả các bản ghi từ bảng Shipper có liên kết với bản ghi orderId
                var shippersToDelete = await _context.Shippers.Where(s => s.OrderId == orderId).ToListAsync();
                _context.Shippers.RemoveRange(shippersToDelete);

                await _context.SaveChangesAsync();

                return Ok($"Order with ID {orderId} has been deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting order: {ex.Message}");
            }
        }

    }
}
