using System;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BannerController : ControllerBase
    {
        private readonly IBannerService _bannerService;

        public BannerController(IBannerService bannerService)
        {
            _bannerService = bannerService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> CreateBanner([FromForm] BannerModel banner)
        {
            try
            {
                if (banner == null)
                {
                    return BadRequest("Banner data is null.");
                }

                await _bannerService.Create(banner);
                return Ok("Banner created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while creating banner: {ex.Message}");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetBanner(int id)
        {
            try
            {
                var banner = await _bannerService.GetById(id);
                if (banner == null)
                {
                    return NotFound("Banner not found.");
                }
                return Ok(banner);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving banner: {ex.Message}");
            }
        }
        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateBanner(int id, [FromForm] Banner2Model banner)
        {
            try
            {
                if (banner == null)
                {
                    return BadRequest("Banner data is null.");
                }

                var existingBanner = await _bannerService.GetById(id);
                if (existingBanner == null)
                {
                    return NotFound("Banner not found.");
                }

                banner.BannerId = id;
                await _bannerService.Update(banner);
                return Ok("Banner updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while updating banner: {ex.Message}");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBanner(int id)
        {
            try
            {
                var existingBanner = await _bannerService.GetById(id);
                if (existingBanner == null)
                {
                    return NotFound("Banner not found.");
                }

                await _bannerService.Delete(id);
                return Ok("Banner deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while deleting banner: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBanners()
        {
            try
            {
                var banners = await _bannerService.GetAll();
                return Ok(banners);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving banners: {ex.Message}");
            }
        }
    }
}
