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
    public class SupplierController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SupplierController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSupplier([FromBody] SupplierModel supplier)
        {
            try
            {
                if (supplier == null)
                {
                    return BadRequest("Supplier data is null.");
                }

                await _supplierService.Create(supplier);
                return Ok("Supplier created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating supplier: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSupplier(int id)
        {
            try
            {
                await _supplierService.Delete(id);
                return Ok("Supplier deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting supplier: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSuppliers()
        {
            try
            {
                var suppliers = await _supplierService.GetAll();
                return Ok(suppliers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving suppliers: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSupplier(int id)
        {
            try
            {
                var supplier = await _supplierService.GetById(id);
                if (supplier == null)
                {
                    return NotFound("Supplier not found.");
                }
                return Ok(supplier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving supplier: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSupplier(int id, [FromBody] SupplierModel1 supplier)
        {
            try
            {
                if (supplier == null)
                {
                    return BadRequest("Supplier data is null.");
                }

                var existingSupplier = await _supplierService.GetById(id);
                if (existingSupplier == null)
                {
                    return NotFound("Supplier not found.");
                }

                supplier.SupplierId = id;
                await _supplierService.Update(supplier);
                return Ok("Supplier updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating supplier: {ex.Message}");
            }
        }

    }
}
