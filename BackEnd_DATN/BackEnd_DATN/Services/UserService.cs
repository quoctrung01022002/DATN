using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Reponse;
using BackEnd_DATN.Repositories;
using BackEnd_DATN.Request;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BackEnd_DATN.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task Create(UserModel1 user)
        {
            await _userRepository.Create(user);
        }

        public async Task<bool> Delete(int id)
        {
            return await _userRepository.Delete(id);
        }

        public async Task<IEnumerable<UserResponse2>> GetAllCustomer()
        {
            return await _userRepository.GetAllCustomer();
        }

        public async Task<IEnumerable<User>> GetAllStaff()
        {
            return await _userRepository.GetAllStaff();
        }

        public async Task<UserResponse1> GetById(int id)
        {
            return await _userRepository.GetById(id);
        }

        public async Task<IEnumerable<UserRequest>> Search(string keyword)
        {
            return await _userRepository.Search(keyword);
        }

        public async Task<User> Update(int id, UserResponse user)
        {
            return await _userRepository.Update(id,user);
        }

        public async Task<WarningLog> UpdateWarningCount(int id, UserResponse3 user)
        {
            return await _userRepository.UpdateWarningCount(id, user);
        }
    }
}
