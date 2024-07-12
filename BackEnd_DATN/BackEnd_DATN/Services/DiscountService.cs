using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class DiscountService : IDiscountService
    {
        private readonly IDiscountRepository _discountRepository;

        public DiscountService(IDiscountRepository discountRepository)
        {
            _discountRepository = discountRepository;
        }

        public async Task Create(DiscountModel discountModel)
        {
            try
            {
                await _discountRepository.Create(discountModel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating discount.", ex);
            }
        }

        public async Task<Discount> GetById(int id)
        {
            try
            {
                return await _discountRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while getting discount by id.", ex);
            }
        }

        public async Task Update(DiscountModel1 discountModel)
        {
            try
            {
                await _discountRepository.Update(discountModel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while updating discount.", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                await _discountRepository.Delete(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while deleting discount.", ex);
            }
        }

        public async Task<List<Discount>> GetAll()
        {
            try
            {
                return await _discountRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while getting all discounts.", ex);
            }
        }
    }
}
