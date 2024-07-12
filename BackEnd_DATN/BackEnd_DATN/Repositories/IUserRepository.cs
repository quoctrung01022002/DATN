using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Request;

namespace BackEnd_DATN.Repositories
{
    public interface IUserRepository
    {
        Task Create(UserModel1 user);
        Task<IEnumerable<UserResponse2>> GetAllCustomer();
        Task<IEnumerable<User>> GetAllStaff();
        Task<UserResponse1> GetById(int id);
        Task<User> Update(int id, UserResponse user);
        Task<WarningLog> UpdateWarningCount(int id, UserResponse3 user);
        Task<bool> Delete(int id);
        Task<IEnumerable<UserRequest>> Search(string keyword);
    }
}
