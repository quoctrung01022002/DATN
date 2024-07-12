using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Product1Controller : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _env;
        public Product1Controller(IProductService productService, IWebHostEnvironment env)
        {
            _env = env;
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProductsAsync()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var product = await _productService.GetById(id);
                if (product == null)
                {
                    return NotFound();
                }
                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create(ProductModel2 productModel)
        {
            try
            {
                if (productModel == null)
                    return BadRequest("Invalid product data");

                // Gọi phương thức tạo sản phẩm trong service và truyền productModel vào
                await _productService.Create(productModel);

                return Ok("Product created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductModel1 product)
        {
            try
            {
                var  updatedProduct = await _productService.Update(id, product);
                return Ok(updatedProduct); // Trả về sản phẩm đã được cập nhật trong phần body của phản hồi HTTP
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productService.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProductsAsync([FromQuery] string keyword)
        {
            try
            {
                var products = await _productService.SearchProductsAsync(keyword);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("producttype/{productTypeId}")]
        public async Task<IActionResult> GetProductsByProductTypeName(int productTypeId)
        {
            try
            {
                var products = await _productService.GetProductsByProductTypeNameAsync(productTypeId);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("price")]
        public async Task<IActionResult> GetProductsByPriceRange([FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
        {
            try
            {
                var products = await _productService.GetProductsByPriceRangeAsync(minPrice, maxPrice);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("priceAndType/{productTypeId}")]
        public async Task<IActionResult> GetProductsByPriceRangeAndType([FromRoute] int productTypeId, [FromQuery] decimal minPrice, [FromQuery] decimal maxPrice)
        {
            try
            {
                var products = await _productService.GetProductsByPriceProductTypeIdRangeAsync(productTypeId, minPrice, maxPrice);
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpGet("product-requests")]
        public async Task<IActionResult> GetProductRequests()
        {
            try
            {
                var productRequests = await _productService.GetProductRequestsAsync();
                return Ok(productRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
