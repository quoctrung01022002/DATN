using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Services
{
    public interface IBannerService
    {
        Task Create(BannerModel banner);
        Task<Banner> GetById(int id);
        Task Update(Banner2Model banner);
        Task Delete(int id);
        Task<List<Banner>> GetAll();
    }
}
