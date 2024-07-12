using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IntroduceController : ControllerBase
    {
        private readonly IIntroduceRepository _introduceRepository;

        public IntroduceController(IIntroduceRepository introduceRepository)
        {
            _introduceRepository = introduceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var introduces = await _introduceRepository.GetAll();
                return Ok(introduces);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var introduce = await _introduceRepository.GetById(id);
                if (introduce == null)
                {
                    return NotFound();
                }
                return Ok(introduce);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] IntroduceModel introduceModel)
        {
            try
            {
                await _introduceRepository.Create(introduceModel);
                return StatusCode(StatusCodes.Status201Created);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] IntroduceModel2 introduceModel)
        {
            try
            {
                introduceModel.IntroduceId = id; // Ensure the ID is set for update
                await _introduceRepository.Update(introduceModel);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _introduceRepository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
    }
}
