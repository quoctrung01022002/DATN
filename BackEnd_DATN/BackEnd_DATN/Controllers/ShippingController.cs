using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;
using Microsoft.AspNetCore.Http;

namespace BackEnd_DATN.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShippingController : ControllerBase
    {
        private readonly IShippingRepository _shippingRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ShippingController(IShippingRepository shippingRepository, IHttpContextAccessor httpContextAccessor)
        {
            _shippingRepository = shippingRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost]
        public async Task<IActionResult> CreateShipping(ShippingModel shippingModel)
        {
            try
            {
                await _shippingRepository.Create(shippingModel);
                return Ok("Shipping created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShippingById(int id)
        {
            var shipping = await _shippingRepository.GetById(id);
            if (shipping == null)
            {
                return NotFound("Shipping not found.");
            }
            return Ok(shipping);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateShipping(int id, ShippingModel1 shippingModel)
        {
            shippingModel.ShippingId = id;
            try
            {
                await _shippingRepository.Update(shippingModel);
                return Ok("Shipping updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShipping(int id)
        {
            try
            {
                await _shippingRepository.Delete(id);
                return Ok("Shipping deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllShippings()
        {
            try
            {
                var shippings = await _shippingRepository.GetAll();
                return Ok(shippings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("order-status-1")]
        public async Task<IActionResult> GetAllOrdersWithStatus1()
        {
            try
            {
                var orders = await _shippingRepository.GetAllOrderStatus1();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("order-status-2")]
        public async Task<IActionResult> GetAllOrdersWithStatus2()
        {
            try
            {
                var orders = await _shippingRepository.GetAllOrderStatus2();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("{orderId}/receive")]
        public async Task<IActionResult> ReceiveOrder(int orderId)
        {
            try
            {
                await _shippingRepository.UpdateOrderStatus(orderId, 2); // 2 là trạng thái mới sau khi nhận đơn
                return Ok("Đã nhận đơn hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi nhận đơn hàng: {ex.Message}");
            }
        }
        [HttpPost("{orderId}/ship")]
        public async Task<IActionResult> ShipOrder(int orderId)
        {
            try
            {
                await _shippingRepository.UpdateOrderStatus1(orderId, 3); // 3 là trạng thái mới sau khi gửi hàng
                return Ok("Đã gửi hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi gửi hàng: {ex.Message}");
            }
        }

        [HttpPost("{orderId}/return")]
        public async Task<IActionResult> ReturnOrder(int orderId)
        {
            try
            {
                await _shippingRepository.UpdateOrderStatus1(orderId, 4); // 4 là trạng thái mới sau khi trả hàng
                return Ok("Đã trả hàng thành công");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi trả hàng: {ex.Message}");
            }
        }
        [HttpGet("orders/{orderId}")]
        public async Task<IActionResult> GetOrderByOrderId(int orderId)
        {
            try
            {
                var order = await _shippingRepository.GetByOrderId(orderId);

                if (order == null)
                {
                    return NotFound("Order not found.");
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
