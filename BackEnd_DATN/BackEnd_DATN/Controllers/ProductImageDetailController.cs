using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using BackEnd_DATN.Models;
using BackEnd_DATN.Services;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImageDetailController : ControllerBase
    {
        private readonly IProductImageDetailService _productImageDetailService;

        public ProductImageDetailController([FromForm] IProductImageDetailService productImageDetailService)
        {
            _productImageDetailService = productImageDetailService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateProductImageDetail([FromForm] ProductImageDetailModel productImageDetail)
        {
            try
            {
                if (productImageDetail == null)
                {
                    return BadRequest("Product image detail data is null.");
                }

                await _productImageDetailService.Create(productImageDetail);
                return Ok("Product image detail created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating product image detail: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductImageDetail(int id)
        {
            try
            {
                var productImageDetail = await _productImageDetailService.GetById(id);
                if (productImageDetail == null)
                {
                    return NotFound("Product image detail not found.");
                }
                return Ok(productImageDetail);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving product image detail: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProductImageDetail(int id, [FromForm] ProductImageDetailModel1 productImageDetail)
        {
            try
            {
                if (productImageDetail == null)
                {
                    return BadRequest("Product image detail data is null.");
                }

                var existingProductImageDetail = await _productImageDetailService.GetById(id);
                if (existingProductImageDetail == null)
                {
                    return NotFound("Product image detail not found.");
                }

                // Gán id từ route parameter cho productImageDetail
                productImageDetail.ProductImageId = id;

                await _productImageDetailService.Update(productImageDetail);
                return Ok("Product image detail updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating product image detail: {ex.Message}");
            }
        }




        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductImageDetail(int id)
        {
            try
            {
                var existingProductImageDetail = await _productImageDetailService.GetById(id);
                if (existingProductImageDetail == null)
                {
                    return NotFound("Product image detail not found.");
                }

                await _productImageDetailService.Delete(id);
                return Ok("Product image detail deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting product image detail: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductImageDetails()
        {
            try
            {
                var productImageDetails = await _productImageDetailService.GetAll();
                return Ok(productImageDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving product image details: {ex.Message}");
            }
        }
    }
}
