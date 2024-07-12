using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Controllers;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BackEnd_DATN.Repositories
{
    public class ShippingRepository : IShippingRepository
    {
        private readonly DatnTrung62132908Context _context;
        private readonly ILogger<ProductController> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ShippingRepository(DatnTrung62132908Context context, ILogger<ProductController> logger, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task Create(ShippingModel shipping)
        {
            try
            {
                var newShipping = new Shipping
                {
                    ShippingUnitPrice = shipping.ShippingUnitPrice,
                    CreatedAt = DateTime.Now,
                };
                _context.Shippings.Add(newShipping);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating shipping.", ex);
            }
        }

        public async Task<Shipping> GetById(int id)
        {
            return await _context.Shippings.FindAsync(id);
        }

        public async Task Update(ShippingModel1 shipping)
        {
            var existingShipping = await _context.Shippings.FindAsync(shipping.ShippingId);
            if (existingShipping != null)
            {
                existingShipping.ShippingUnitPrice = shipping.ShippingUnitPrice;
                existingShipping.UpdatedAt = DateTime.Now;

                _context.Entry(existingShipping).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }

        public async Task Delete(int id)
        {
            var shipping = await _context.Shippings.FindAsync(id);
            if (shipping != null)
            {
                _context.Shippings.Remove(shipping);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Shipping>> GetAll()
        {
            return await _context.Shippings.ToListAsync();
        }
        public async Task<OrderModel> GetByOrderId(int orderId)
        {
            try
            {
                // Retrieve the order with the specified OrderId and include related data
                var order = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);

                // If no order is found, return null
                if (order == null)
                {
                    return null;
                }

                // Retrieve the order details for the specified order
                var details = await (from od in _context.OrderDetails
                                     join p in _context.Products on od.ProductId equals p.ProductId
                                     where od.OrderId == order.OrderId
                                     select new OrderDetailModel
                                     {
                                         OrderId = od.OrderId,
                                         ProductId = od.ProductId,
                                         ProductImage = p.ProductImage,
                                         ProductName = p.ProductName,
                                         Quantity = od.Quantity,
                                         Price = p.Price,
                                         DiscountValue = p.Discount == null ? 0.0 : (double)p.Discount.DiscountValue
                                     }).ToListAsync();

                // Construct the OrderModel
                var orderModel = new OrderModel
                {
                    OrderId = order.OrderId,
                    UserId = order.UserId,
                    Name = order.Name,
                    PhoneNumber = order.PhoneNumber,
                    Address = order.Address,
                    Gender = order.Gender,
                    OrderDate = order.OrderDate,
                    PaymentMethod = order.PaymentMethod,
                    Status = order.Status,
                    OrderDetails = details
                };

                return orderModel;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving the order with the specified OrderId", ex);
            }
        }


        public async Task<List<OrderModel>> GetAllOrderStatus1()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .Where(o => o.Status == 1)
                    .ToListAsync();

                var orderModels = new List<OrderModel>();

                foreach (var order in orders)
                {
                    var details = await (from od in _context.OrderDetails
                                         join p in _context.Products on od.ProductId equals p.ProductId
                                         where od.OrderId == order.OrderId
                                         select new OrderDetailModel
                                         {
                                             OrderId = od.OrderId,
                                             ProductId = od.ProductId,            
                                             ProductImage = p.ProductImage,
                                             ProductName = p.ProductName,
                                             Quantity = od.Quantity,
                                             Price = p.Price,
                                             DiscountValue = p.Discount == null ? 0.0 : (double)p.Discount.DiscountValue
                                         }).ToListAsync();

                    orderModels.Add(new OrderModel
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        Name = order.Name,
                        PhoneNumber = order.PhoneNumber,
                        Address = order.Address,
                        Gender = order.Gender,
                        OrderDate = order.OrderDate,
                        PaymentMethod = order.PaymentMethod,
                        Status = order.Status,
                        OrderDetails = details
                    });
                }

                return orderModels;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving list of orders with status 1", ex);
            }
        }


        public async Task<List<OrderModel>> GetAllOrderStatus2()
        {
            try
            {
                // Lấy userId từ claim
                var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId")?.Value;

                // Kiểm tra xem userIdClaim có tồn tại hay không
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                {
                    throw new UnauthorizedAccessException("User is not authorized.");
                }

                var orders = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.OrderDetails)
                        .ThenInclude(od => od.Product)
                    .Include(o => o.Shippers) // Kết nối Order với Shipper
                    .Where(o => o.Status == 2 && o.Shippers.Any(s => s.UserId == userId)) // Lọc theo trạng thái và UserId từ Shipper
                    .ToListAsync();

                var orderModels = new List<OrderModel>();

                foreach (var order in orders)
                {
                    var details = await (from od in _context.OrderDetails
                                         join p in _context.Products on od.ProductId equals p.ProductId
                                         where od.OrderId == order.OrderId
                                         select new OrderDetailModel
                                         {
                                             OrderId = od.OrderId,
                                             ProductId = od.ProductId,
                                             ProductImage = p.ProductImage,
                                             ProductName = p.ProductName,
                                             Quantity = od.Quantity,
                                             Price = p.Price,
                                             DiscountValue = p.Discount == null ? 0.0 : (double)p.Discount.DiscountValue
                                         }).ToListAsync();

                    orderModels.Add(new OrderModel
                    {
                        OrderId = order.OrderId,
                        UserId = order.UserId,
                        Name = order.Name,
                        PhoneNumber = order.PhoneNumber,
                        Address = order.Address,
                        Gender = order.Gender,
                        OrderDate = order.OrderDate,
                        PaymentMethod = order.PaymentMethod,
                        Status = order.Status,
                        OrderDetails = details
                    });
                }

                return orderModels;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving list of orders with status 2", ex);
            }
        }


        public async Task UpdateOrderStatus(int orderId, int newStatus)
        {
            // Lấy userId từ claim
            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId")?.Value;

            // Kiểm tra xem userIdClaim có tồn tại hay không
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }

            // Lấy đơn hàng từ cơ sở dữ liệu
            var order = await _context.Orders.FindAsync(orderId);

            // Kiểm tra xem đơn hàng có tồn tại hay không
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {orderId} not found.");
            }

            // Cập nhật trạng thái của đơn hàng và thời gian cập nhật
            order.Status = newStatus;
            order.UpdatedAt = DateTime.Now;

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Tạo một đối tượng Shipper mới
            var shipperModel = new Shipper
            {
                UserId = userId,
                OrderId = orderId,
                CreatedAt = DateTime.Now
            };

            // Thêm Shipper mới vào DbContext
            _context.Shippers.Add(shipperModel);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
        }
        public async Task UpdateOrderStatus1(int orderId, int newStatus)
        {
            // Lấy userId từ claim
            var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst("userId")?.Value;

            // Kiểm tra xem userIdClaim có tồn tại hay không
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User is not authorized.");
            }

            // Lấy đơn hàng từ cơ sở dữ liệu
            var order = await _context.Orders.FindAsync(orderId);

            // Kiểm tra xem đơn hàng có tồn tại hay không
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {orderId} not found.");
            }

            // Cập nhật trạng thái của đơn hàng và thời gian cập nhật
            order.Status = newStatus;
            order.UpdatedAt = DateTime.Now;

            // Lưu thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
          
        }
    }
}
