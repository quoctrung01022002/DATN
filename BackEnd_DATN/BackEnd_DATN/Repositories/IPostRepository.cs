using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Repositories
{
    public interface IPostRepository
    {
        Task Create(PostModel post);
        Task<Post> GetById(int id);
        Task Update(PostModel1 post);
        Task Delete(int id);
        Task<List<Post>> GetAll();
    }
}
