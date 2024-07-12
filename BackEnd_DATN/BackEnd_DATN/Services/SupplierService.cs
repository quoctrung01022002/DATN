using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class SupplierService : ISupplierService
    {
        private ISupplierRepository _supplierRepository;
        public SupplierService(ISupplierRepository supplierRepository)
        {
            _supplierRepository = supplierRepository;
        }

        public async Task Create(SupplierModel supplier)
        {
            try
            {
                await _supplierRepository.Create(supplier);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating supplier.", ex);
            }
        }

        public async Task Delete(int id)
        {
            {
                try
                {
                    await _supplierRepository.Delete(id);
                }
                catch (Exception ex)
                {
                    throw new Exception("Error occurred while deleting supplier.", ex);
                }
            }
        }

        public async Task<List<Supplier>> GetAll()
        {
            return await _supplierRepository.GetAll();
        }

        public async Task<Supplier> GetById(int id)
        {
           return await _supplierRepository.GetById(id);
        }

        public async Task Update(SupplierModel1 supplier)
        {
             await _supplierRepository.Update(supplier);
        }
    }
}
