using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Repositories
{
    public interface IShippingRepository
    {
        Task Create(ShippingModel shipping);
        Task<Shipping> GetById(int id);
        Task Update(ShippingModel1 shipping);
        Task Delete(int id);
        Task<List<Shipping>> GetAll();
        Task<OrderModel> GetByOrderId(int orderId);
        Task<List<OrderModel>> GetAllOrderStatus1();
        Task<List<OrderModel>> GetAllOrderStatus2();
        Task UpdateOrderStatus(int orderId, int newStatus);
        Task UpdateOrderStatus1(int orderId, int newStatus);
    }
}
