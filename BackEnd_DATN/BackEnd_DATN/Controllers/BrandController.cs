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
    public class BrandController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBrand([FromBody] BrandModel brandModel)
        {
            try
            {
                if (brandModel == null)
                {
                    return BadRequest("Brand data is null.");
                }

                int brandId = await _brandService.CreateBrand(brandModel);
                return Ok($"Brand created successfully. BrandId: {brandId}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating brand: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBrand(int id)
        {
            try
            {
                var brand = await _brandService.GetBrandById(id);
                if (brand == null)
                {
                    return NotFound("Brand not found.");
                }
                return Ok(brand);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving brand: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBrand(int id, [FromBody] BrandModel1 brandModel)
        {
            try
            {
                if (brandModel == null)
                {
                    return BadRequest("Brand data is null.");
                }

                brandModel.BrandId = id; // Gán id vào BrandId
                await _brandService.UpdateBrand(brandModel);
                return Ok("Brand updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating brand: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            try
            {
                await _brandService.DeleteBrand(id);
                return Ok("Brand deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting brand: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBrands()
        {
            try
            {
                var brands = await _brandService.GetAllBrands();
                return Ok(brands);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving brands: {ex.Message}");
            }
        }
    }
}
