using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Services
{
    public interface IBrandService
    {
        Task<IEnumerable<Brand>> GetAllBrands();
        Task<Brand> GetBrandById(int id);
        Task<int> CreateBrand(BrandModel brand);
        Task UpdateBrand(BrandModel1 brand);
        Task DeleteBrand(int id);
    }
}
