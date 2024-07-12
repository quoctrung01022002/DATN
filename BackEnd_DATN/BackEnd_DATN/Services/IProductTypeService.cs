using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;

namespace BackEnd_DATN.Services
{
    public interface IProductTypeService
    {
        Task Create(ProductTypeModel productType);
        Task<ProductType> GetById(int id);
        Task Update(ProductTypeModel1 productType);
        Task Delete(int id);
        Task<List<ProductType>> GetAll();
    }
}
