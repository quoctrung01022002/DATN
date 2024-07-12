using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd_DATN.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RevenueController : ControllerBase
    {
        private readonly DatnTrung62132908Context _context;

        public RevenueController(DatnTrung62132908Context context)
        {
            _context = context;
        }

        // GET: api/Revenue
        [HttpGet]
        public async Task<ActionResult<decimal>> GetRevenue([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.OrderDetails
                    .Include(od => od.Order)
                    .AsQueryable();

                if (month.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value && od.Order.Status == 3);
                }

                if (year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Year == year.Value && od.Order.Status == 3);
                }

                var totalRevenue = await query.SumAsync(od => (od.Price * od.Quantity) * (1 - (od.DiscountValue != 0 ? od.DiscountValue : 0)));

                return totalRevenue;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }


        // GET: api/Revenue/CountOrders
        [HttpGet("CountOrders")]
        public async Task<ActionResult<int>> CountOrders([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.Orders
                    .AsQueryable();

                if (month.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Month == month.Value);
                }

                if (year.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Year == year.Value);
                }

                var countOrders = await query.CountAsync(o => o.Status == 3);

                return countOrders;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        // GET: api/Revenue/CountFalseOrders
        [HttpGet("CountFalseOrders")]
        public async Task<ActionResult<int>> CountFalseOrders([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.Orders
                    .AsQueryable();

                if (month.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Month == month.Value);
                }

                if (year.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Year == year.Value);
                }

                var countFalseOrders = await query.CountAsync(o => o.Status == 0);

                return countFalseOrders;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        [HttpGet("CountDistinctProductIds")]
        public async Task<ActionResult<int>> CountDistinctProductIds([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.OrderDetails
                    .AsQueryable();

                if (month.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value && od.Order.Status == 3);
                }

                if (year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Year == year.Value && od.Order.Status == 3);
                }

                var countDistinctProductIds = await query.Select(od => od.ProductId).Distinct().CountAsync();

                return countDistinctProductIds;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        [HttpGet("CountDistinctUserIds")]
        public async Task<ActionResult<int>> CountDistinctUserIds([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.Orders
                    .AsQueryable();

                if (month.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Month == month.Value);
                }

                if (year.HasValue)
                {
                    query = query.Where(o => o.OrderDate.Year == year.Value);
                }

                var countDistinctUserIds = await query.Select(o => o.UserId).Distinct().CountAsync();

                return countDistinctUserIds;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        // GET: api/Revenue/CountInventoryMovements
        [HttpGet("CountInventoryMovements")]
        public async Task<ActionResult<int>> CountInventoryMovements([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.Products
                    .AsQueryable();

                if (month.HasValue && year.HasValue)
                {
                    query = query.Where(p => p.CreateAt.HasValue && p.CreateAt.Value.Month == month.Value && p.CreateAt.Value.Year == year.Value);
                }
                else if (month.HasValue)
                {
                    query = query.Where(p => p.CreateAt.HasValue && p.CreateAt.Value.Month == month.Value);
                }
                else if (year.HasValue)
                {
                    query = query.Where(p => p.CreateAt.HasValue && p.CreateAt.Value.Year == year.Value);
                }

                var totalQuantity = await query.SumAsync(p => p.Quantity);

                return totalQuantity;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        // GET: api/Revenue/CountInventoryMovements
        [HttpGet("CountInventoryMovements1")]
        public async Task<ActionResult<int>> CountInventoryMovements1([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.OrderDetails
                    .Where(od => od.Order.OrderDate != null);

                if (month.HasValue && year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value && od.Order.OrderDate.Year == year.Value);
                }
                else if (month.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value);
                }
                else if (year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Year == year.Value);
                }

                var totalQuantity = await query.SumAsync(od => od.Quantity);

                return totalQuantity;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        [HttpGet("CountSoldProductsByType")]
        public async Task<ActionResult<Dictionary<string, int>>> CountSoldProductsByType([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var query = _context.OrderDetails
                    .Include(od => od.Product)
                    .ThenInclude(p => p.ProductType) // Kết nối với loại sản phẩm
                    .Where(od => od.Order.Status == 3) // Chỉ lấy các đơn hàng có Status = 3
                    .AsQueryable();

                if (month.HasValue && year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value && od.Order.OrderDate.Year == year.Value);
                }
                else if (month.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Month == month.Value);
                }
                else if (year.HasValue)
                {
                    query = query.Where(od => od.Order.OrderDate.Year == year.Value);
                }

                var productTypeSales = await query
                    .GroupBy(od => od.Product.ProductType.ProductTypeName) // Nhóm theo tên loại sản phẩm
                    .ToDictionaryAsync(g => g.Key, g => g.Sum(od => od.Quantity));

                return productTypeSales;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // GET: api/Revenue
        [HttpGet("RevenueDate")]
        public async Task<ActionResult<List<KeyValuePair<string, decimal>>>> GetRevenueByDateRange([FromQuery] int? month, [FromQuery] int? year)
        {
            try
            {
                var revenueByDateRange = new List<KeyValuePair<string, decimal>>();

                int daysInMonth = DateTime.DaysInMonth(year ?? DateTime.Now.Year, month ?? DateTime.Now.Month);

                for (int i = 1; i <= daysInMonth; i += 7)
                {
                    int startDay = i;
                    int endDay = Math.Min(i + 6, daysInMonth);

                    DateTime startDate = new DateTime(year ?? DateTime.Now.Year, month ?? DateTime.Now.Month, startDay);
                    DateTime endDate = new DateTime(year ?? DateTime.Now.Year, month ?? DateTime.Now.Month, endDay);

                    var query = _context.OrderDetails
                        .Include(od => od.Order)
                        .Where(od => od.Order.OrderDate >= startDate && od.Order.OrderDate <= endDate && od.Order.Status == 3);

                    var revenue = await query.SumAsync(od => (od.Price * od.Quantity) * (1 - (od.DiscountValue != 0 ? od.DiscountValue : 0)));

                    revenueByDateRange.Add(new($"Từ {startDate:dd/MM} đến {endDate:dd/MM}", revenue));
                }

                return revenueByDateRange;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi: {ex.Message}");
            }
        }





        private int GetStartDate(int range)
        {
            switch (range)
            {
                case 1:
                    return 1;
                case 2:
                    return 8;
                case 3:
                    return 15;
                case 4:
                    return 23;
                default:
                    return 1;
            }
        }

        private int GetEndDate(int range)
        {
            switch (range)
            {
                case 1:
                    return 7;
                case 2:
                    return 14;
                case 3:
                    return 22;
                case 4:
                    return DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month);
                default:
                    return 1;
            }
        }
        // GET: api/Revenue/TotalRevenueByMonth
        [HttpGet("TotalRevenueByMonth")]
        public async Task<ActionResult<Dictionary<int, decimal>>> GetTotalRevenueByMonth([FromQuery] int? year)
        {
            try
            {
                var revenueByMonth = new Dictionary<int, decimal>();

                for (int month = 1; month <= 12; month++)
                {
                    var query = _context.OrderDetails
                        .Include(od => od.Order)
                        .Where(od => od.Order.OrderDate.Year == year && od.Order.OrderDate.Month == month && od.Order.Status == 3);

                    var totalRevenue = await query.SumAsync(od => (od.Price * od.Quantity) * (1 - (od.DiscountValue != 0 ? od.DiscountValue : 0)));

                    revenueByMonth.Add(month, totalRevenue);
                }

                return revenueByMonth;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }




    }
}
