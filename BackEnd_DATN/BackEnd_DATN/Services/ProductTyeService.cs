using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class ProductTypeService : IProductTypeService
    {
        private readonly IProductTypeRepository _productTypeRepository;

        public ProductTypeService(IProductTypeRepository productTypeRepository)
        {
            _productTypeRepository = productTypeRepository;
        }

        public async Task Create(ProductTypeModel productType)
        {
            await _productTypeRepository.Create(productType);
        }

        public async Task<ProductType> GetById(int id)
        {
            return await _productTypeRepository.GetById(id);
        }

        public async Task Update(ProductTypeModel1 productType)
        {
            await _productTypeRepository.Update(productType);
        }

        public async Task Delete(int id)
        {
            await _productTypeRepository.Delete(id);
        }
        public async Task<List<ProductType>> GetAll()
        {
            return await _productTypeRepository.GetAll();
        }
    }
}
