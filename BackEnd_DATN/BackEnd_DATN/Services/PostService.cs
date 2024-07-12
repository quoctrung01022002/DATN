using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class PostService : IPostService
    {
        private readonly IPostRepository _postRepository;

        public PostService(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }

        public async Task Create(PostModel post)
        {
            await _postRepository.Create(post);
        }

        public async Task<List<Post>> GetAll()
        {
            return await _postRepository.GetAll();
        }

        public async Task<Post> GetById(int id)
        {
            return await _postRepository.GetById(id);
        }

        public async Task Update(PostModel1 post)
        {
            await _postRepository.Update(post);
        }

        public async Task Delete(int id)
        {
            await _postRepository.Delete(id);
        }
    }
}
