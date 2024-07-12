using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Request;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Services
{
    public interface IProductService
    {
        Task Create(ProductModel2 product);
        Task<IEnumerable<ProductRequest>> GetAllProductsAsync();
        Task<IEnumerable<ProductModel>> SearchProductsAsync(string keyword);
        Task<ProductModel3> GetById(int id);
        Task<Product> Update(int id, ProductModel1 product);
        Task Delete(int id);
       /* Task<string> SaveFile(ProductModel product);*/ // Thêm phương thức SaveFile vào interface
        Task<IEnumerable<ProductReponse>> GetProductsByProductTypeNameAsync(int ProductTypeId);
        Task<IEnumerable<ProductRequest>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice);
        Task<IEnumerable<ProductReponse>> GetProductsByPriceProductTypeIdRangeAsync(int productTypeId, decimal minPrice, decimal maxPrice);
        Task<IEnumerable<ProductRequest>> GetProductRequestsAsync();

    }
}
