using System;
using System.Threading.Tasks;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTypeController : ControllerBase
    {
        private readonly IProductTypeService _productTypeService;

        public ProductTypeController(IProductTypeService productTypeService)
        {
            _productTypeService = productTypeService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProductType([FromBody] ProductTypeModel productType)
        {
            try
            {
                if (productType == null)
                {
                    return BadRequest("ProductType data is null.");
                }

                await _productTypeService.Create(productType);
                return Ok("ProductType created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating product type: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductType(int id)
        {
            try
            {
                var productType = await _productTypeService.GetById(id);
                if (productType == null)
                {
                    return NotFound("ProductType not found.");
                }
                return Ok(productType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving product type: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductType(int id, [FromBody] ProductTypeModel1 productType)
        {
            try
            {
                if (productType == null)
                {
                    return BadRequest("ProductType data is null.");
                }

                var existingProductType = await _productTypeService.GetById(id);
                if (existingProductType == null)
                {
                    return NotFound("ProductType not found.");
                }

                productType.ProductTypeId = id;
                await _productTypeService.Update(productType);
                return Ok("ProductType updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating product type: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductType(int id)
        {
            try
            {
                var existingProductType = await _productTypeService.GetById(id);
                if (existingProductType == null)
                {
                    return NotFound("ProductType not found.");
                }

                await _productTypeService.Delete(id);
                return Ok("ProductType deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting product type: {ex.Message}");
            }
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProductTypes()
        {
            try
            {
                var productTypes = await _productTypeService.GetAll();
                return Ok(productTypes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving product types: {ex.Message}");
            }
        }
    }
}
