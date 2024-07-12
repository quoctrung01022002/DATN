using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BackEnd_DATN.Models;
using BackEnd_DATN.Services;
using BackEnd_DATN.Entities;

namespace BackEnd_DATN.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IWebHostEnvironment _env;

        public PostController(IPostService postService, IWebHostEnvironment env)
        {
            _postService = postService;
            _env = env;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetAllPosts()
        {
            try
            {
                var posts = await _postService.GetAll();
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving posts: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPostById(int id)
        {
            try
            {
                var post = await _postService.GetById(id);
                if (post == null)
                {
                    return NotFound($"Post with id {id} not found");
                }
                return Ok(post);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving post: {ex.Message}");
            }
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Post>> CreatePost([FromForm] PostModel postModel)
        {
            try
            {
                await _postService.Create(postModel);
                return Ok("Post created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating post: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> UpdatePost(int id, [FromForm] PostModel1 postModel)
        {
            try
            {
                postModel.PostId = id;
                await _postService.Update(postModel);
                return Ok($"Post with id {id} updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating post: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePost(int id)
        {
            try
            {
                await _postService.Delete(id);
                return Ok($"Post with id {id} deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting post: {ex.Message}");
            }
        }
    }
}
