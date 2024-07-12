using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Services
{
    public class ProductImageDetailService : IProductImageDetailService
    {
        private readonly IProductImageDeatailRepository _productImageDetailRepository;
        private readonly IWebHostEnvironment _env;

        public ProductImageDetailService(IProductImageDeatailRepository productImageDetailRepository, IWebHostEnvironment env)
        {
            _productImageDetailRepository = productImageDetailRepository;
            _env = env;
        }

        public async Task Create(ProductImageDetailModel productImageDetail)
        {
            await _productImageDetailRepository.Create(productImageDetail);
        }

        public async Task<ProductImageDetail> GetById(int id)
        {
            return await _productImageDetailRepository.GetById(id);
        }

        public async Task Update(ProductImageDetailModel1 productImageDetail)
        {
            await _productImageDetailRepository.Update(productImageDetail);
        }

        public async Task Delete(int id)
        {
            await _productImageDetailRepository.Delete(id);
        }

        public async Task<List<ProductImageDetail>> GetAll()
        {
            return await _productImageDetailRepository.GetAll();
        }
    }
}
