﻿using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;

namespace BackEnd_DATN.Services
{
    public interface ISupplierService
    {
        Task Create(SupplierModel supplier);
        Task<Supplier> GetById(int id);
        Task Update(SupplierModel1 supplier);
        Task Delete(int id);
        Task<List<Supplier>> GetAll();
    }
}
