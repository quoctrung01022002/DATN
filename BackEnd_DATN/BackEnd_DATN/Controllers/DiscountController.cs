using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Models;
using BackEnd_DATN.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountController : ControllerBase
    {
        private readonly IDiscountService _discountService;

        public DiscountController(IDiscountService discountService)
        {
            _discountService = discountService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateDiscount([FromBody] DiscountModel discountModel)
        {
            try
            {
                if (discountModel == null)
                {
                    return BadRequest("Discount data is null.");
                }

                await _discountService.Create(discountModel);
                return Ok("Discount created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating discount: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDiscount(int id)
        {
            try
            {
                var discount = await _discountService.GetById(id);
                if (discount == null)
                {
                    return NotFound("Discount not found.");
                }
                return Ok(discount);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving discount: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDiscount(int id, [FromBody] DiscountModel1 discountModel)
        {
            try
            {
                if (discountModel == null)
                {
                    return BadRequest("Discount data is null.");
                }

                var existingDiscount = await _discountService.GetById(id);
                if (existingDiscount == null)
                {
                    return NotFound("Discount not found.");
                }

                discountModel.DiscountId = id;
                await _discountService.Update(discountModel);
                return Ok("Discount updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating discount: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscount(int id)
        {
            try
            {
                var existingDiscount = await _discountService.GetById(id);
                if (existingDiscount == null)
                {
                    return NotFound("Discount not found.");
                }

                await _discountService.Delete(id);
                return Ok("Discount deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting discount: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDiscounts()
        {
            try
            {
                var discounts = await _discountService.GetAll();
                return Ok(discounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving discounts: {ex.Message}");
            }
        }
    }
}
