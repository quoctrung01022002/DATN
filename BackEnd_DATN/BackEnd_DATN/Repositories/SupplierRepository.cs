using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd_DATN.Repositories
{
    public class SupplierRepository : ISupplierRepository
    {
        private readonly DatnTrung62132908Context _context;
        public SupplierRepository( DatnTrung62132908Context context )
        {
            _context = context;
        }

        public async Task Create(SupplierModel supplier)
        {
            try
            {
                var newSupplier = new Supplier
                {
                    SupplierName = supplier.SupplierName,
                    Address = supplier.Address,
                    PhoneNumber = supplier.PhoneNumber,
                    ContactEmail = supplier.ContactEmail,
                    ContactPerson = supplier.ContactPerson,
                    CreateAt = DateTime.Now,
                    CreatedBy = supplier.CreatedBy,
                };
                _context.Suppliers.Add(newSupplier);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while creating supplier.", ex);
            }
        }

        public async Task Delete(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if(supplier  != null)
            {
                _context.Suppliers.Remove(supplier);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Supplier>> GetAll()
        {
            var supplier = await _context.Suppliers.ToListAsync();
            return supplier.Select(supplier => new Supplier
            {
                SupplierId = supplier.SupplierId,
                SupplierName = supplier.SupplierName,
                Address = supplier.Address,
                PhoneNumber = supplier.PhoneNumber,
                ContactEmail = supplier.ContactEmail,
                ContactPerson = supplier.ContactPerson,
                CreateAt = supplier.CreateAt,
                CreatedBy = supplier.CreatedBy,
                UpdateAt = supplier.UpdateAt,
                UpdateBy = supplier.UpdateBy,
                
            }).ToList();
        }

        public async Task<Supplier> GetById(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if( supplier == null ) {
                return null;
            }
            return new Supplier
            {
                SupplierId = supplier.SupplierId,
                SupplierName = supplier.SupplierName,
                Address = supplier.Address,
                PhoneNumber = supplier.PhoneNumber,
                ContactEmail = supplier.ContactEmail,
                ContactPerson = supplier.ContactPerson,
                CreateAt = DateTime.Now,
                CreatedBy = supplier.CreatedBy,
                UpdateAt = DateTime.Now,
                UpdateBy = supplier.UpdateBy,
            };
        }

        public async Task Update(SupplierModel1 supplier)
        {
            var existingSupplier = await _context.Suppliers.FindAsync(supplier.SupplierId);
            if( existingSupplier != null ) {
                existingSupplier.SupplierName = supplier.SupplierName;
                existingSupplier.Address = supplier.Address;
                existingSupplier.PhoneNumber = supplier.PhoneNumber;    
                existingSupplier.ContactEmail = supplier.ContactEmail;
                existingSupplier.ContactPerson = supplier.ContactPerson;
                existingSupplier.UpdateAt = DateTime.Now;
                existingSupplier.UpdateBy = supplier.UpdateBy;  
                _context.Entry(existingSupplier).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }
    }
}
