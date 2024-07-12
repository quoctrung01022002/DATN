﻿using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Services
{
    public interface IProductImageDetailService
    {
        Task Create(ProductImageDetailModel productDetail);
        Task<ProductImageDetail> GetById(int id);
        Task Update(ProductImageDetailModel1 productDetail);
        Task Delete(int id);
        Task<List<ProductImageDetail>> GetAll();
    }
}
