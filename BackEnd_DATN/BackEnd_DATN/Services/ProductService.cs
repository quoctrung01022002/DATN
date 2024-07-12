using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Repositories;
using BackEnd_DATN.Request;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task Create(ProductModel2 product)
        {
            await _productRepository.Create(product);
        }

        public async Task Delete(int id)
        {
            await _productRepository.Delete(id);
        }

        public async Task<IEnumerable<ProductRequest>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllProductsAsync();
        }

        public async Task<ProductModel3> GetById(int id)
        {
            return await _productRepository.GetById(id);
        }

        public async Task<IEnumerable<ProductReponse>> GetProductsByProductTypeNameAsync(int ProductTypeId)
        {
             return await _productRepository.GetProductsByProductTypeNameAsync(ProductTypeId);
        }

        public async Task<IEnumerable<ProductModel>> SearchProductsAsync(string keyword)
        {
            return await _productRepository.SearchProductsAsync(keyword);
        }

        public async Task<Product> Update(int id, ProductModel1 product)
        {
           return  await _productRepository.Update(id, product);
        }

        //public async Task<string> SaveFile(ProductModel product)
        //{
        //    return await _productRepository.SaveFile(product);
        //}
        //public async Task<IEnumerable<ProductRequest>> GetProductsByProductTypeNameAsync(int ProductTypeId)
        //{
        //    return await _productRepository.GetProductsByProductTypeNameAsync(ProductTypeId);
        //}
        public async Task<IEnumerable<ProductRequest>> GetProductsByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        {
            return await _productRepository.GetProductsByPriceRangeAsync(minPrice, maxPrice);
        }
        public async Task<IEnumerable<ProductReponse>> GetProductsByPriceProductTypeIdRangeAsync(int productTypeId, decimal minPrice, decimal maxPrice)
        {
            return await _productRepository.GetProductsByPriceProductTypeIdRangeAsync(productTypeId, minPrice, maxPrice);
        }
        public async Task<IEnumerable<ProductRequest>> GetProductRequestsAsync()
        {
            return await _productRepository.GetProductRequestsAsync();
        }

    }
}
