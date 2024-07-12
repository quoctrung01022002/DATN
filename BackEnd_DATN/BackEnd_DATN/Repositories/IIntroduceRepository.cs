using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Repositories
{
    public interface IIntroduceRepository
    {
        Task Create(IntroduceModel banner);
        Task<Introduce> GetById(int id);
        Task Update(IntroduceModel2 banner);
        Task Delete(int id);
        Task<List<Introduce>> GetAll();
    }
}
