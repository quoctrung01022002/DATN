using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Repositories
{
    public interface IDiscountRepository
    {
        Task Create(DiscountModel discount);
        Task<Discount> GetById(int id);
        Task Update(DiscountModel1 discount);
        Task Delete(int id);
        Task<List<Discount>> GetAll();
    }
}
