using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class BrandService : IBrandService
    {
        private readonly IBrandRepository _brandRepository;

        public BrandService(IBrandRepository brandRepository)
        {
            _brandRepository = brandRepository;
        }

        public async Task<int> CreateBrand(BrandModel brandModel)
        {
            try
            {
                return await _brandRepository.CreateBrand(brandModel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating brand.", ex);
            }
        }

        public async Task<Brand> GetBrandById(int id)
        {
            try
            {
                return await _brandRepository.GetBrandById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while getting brand by id.", ex);
            }
        }

        public async Task UpdateBrand(BrandModel1 brandModel)
        {
            try
            {
                await _brandRepository.UpdateBrand(brandModel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while updating brand.", ex);
            }
        }

        public async Task DeleteBrand(int id)
        {
            try
            {
                await _brandRepository.DeleteBrand(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while deleting brand.", ex);
            }
        }

        public async Task<IEnumerable<Brand>> GetAllBrands()
        {
            try
            {
                return await _brandRepository.GetAllBrands();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while getting all brands.", ex);
            }
        }
    }
}
