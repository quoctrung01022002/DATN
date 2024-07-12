using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Request;
using BackEnd_DATN.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class User1Controller : ControllerBase
    {
        private readonly IUserService _userService;

        public User1Controller(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] UserModel1 user)
        {
            try
            {
                // Perform validation if necessary
                if (user == null)
                {
                    return BadRequest("User data is null.");
                }
                await _userService.Create(user);

                // Return the newly created user
                return Ok("User created successfully.");
            }
            catch (Exception ex)
            {
                // Handle error
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while creating user: {ex.Message}");
            }
        }



        [HttpGet("GetAllCustomer")]
        public async Task<IActionResult> GetAllCustomer()
        {
            var users = await _userService.GetAllCustomer();
            return Ok(users);
        }
        [HttpGet("GetAllStaff")]
        public async Task<IActionResult> GetAllStaff()
        {
            var users = await _userService.GetAllStaff();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UserResponse user)
        {
            try
            {
                var updatedUser = await _userService.Update(id, user);
                return Ok(updatedUser); // Trả về người dùng đã được cập nhật trong phần body của phản hồi HTTP
            }
            catch (InvalidOperationException)
            {
                return NotFound("User not found.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error occurred while updating user: {ex.Message}");
            }
        }
        [HttpPut("{id}/update-warning-count")]
        public async Task<IActionResult> UpdateWarningCount(int id, [FromBody] UserResponse3 user)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid user ID.");
            }

            var updatedUser = await _userService.UpdateWarningCount(id, user);
            if (updatedUser == null)
            {
                return NotFound("User not found.");
            }

            return Ok(updatedUser);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _userService.Delete(id);
            if (!result)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string keyword)
        {
            var users = await _userService.Search(keyword);
            return Ok(users);
        }
    }
}
