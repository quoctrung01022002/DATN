using BackEnd_DATN.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BackEnd_DATN.BackgroundServices
{
    public class DeleteExpireOrderService : BackgroundService
    {
        private readonly TimeSpan _period = TimeSpan.FromSeconds(600);
        private readonly IServiceProvider _serviceProvider;

        public DeleteExpireOrderService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using PeriodicTimer timer = new(_period);

            while (!stoppingToken.IsCancellationRequested &&
                   await timer.WaitForNextTickAsync(stoppingToken))
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<DatnTrung62132908Context>();

                // Delete expired orders
                var orderBele = await context.Orders
                    .Where(c => (c.Status == null || c.Status == 0) && c.OrderDate <= DateTime.Now.AddMinutes(-15))
                    .ToListAsync(stoppingToken);

                var ids = orderBele.Select(o => o.OrderId);

                var orderDetail = context.OrderDetails.Where(od => ids.Contains(od.OrderId));

                context.OrderDetails.RemoveRange(orderDetail);
                context.Orders.RemoveRange(orderBele);

                // Delete users with VerifiedAt == null and RoleName == "Customer"
                var usersToDelete = await context.Users
                    .Where(u => u.VerifiedAt == null && u.RoleName == "Customer")
                    .ToListAsync(stoppingToken);

                context.Users.RemoveRange(usersToDelete);

                await context.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
