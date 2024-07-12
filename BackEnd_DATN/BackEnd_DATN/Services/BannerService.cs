using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd_DATN.Entities;
using BackEnd_DATN.Models;
using BackEnd_DATN.Repositories;

namespace BackEnd_DATN.Services
{
    public class BannerService : IBannerService
    {
        private readonly IBannerRepository _bannerRepository;
        private readonly IWebHostEnvironment _env;

        public BannerService(IBannerRepository bannerRepository, IWebHostEnvironment env)
        {
            _bannerRepository = bannerRepository;
            _env = env; 
        }

        public async Task Create(BannerModel banner)
        {
            await _bannerRepository.Create(banner);
        }

        public async Task<Banner> GetById(int id)
        {
            return await _bannerRepository.GetById(id);
        }

        public async Task Update(Banner2Model banner)
        {
            await _bannerRepository.Update(banner);
        }

        public async Task Delete(int id)
        {
            await _bannerRepository.Delete(id);
        }

        public async Task<List<Banner>> GetAll()
        {
            return await _bannerRepository.GetAll();
        }
    }
}
