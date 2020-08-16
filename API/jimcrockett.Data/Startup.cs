using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;

namespace jimcrockett.Data
{
    public static class Startup
    {
        private static readonly string ConnectionStringName = "jimcrockettDb";
        public static IServiceCollection AddData(this IServiceCollection services)
        {
            Func<IServiceProvider, IOptions<JCDbContextOptions>> optionsFactory = (sp) =>
            {
                string connectionString = GetConnectionString(sp, Startup.ConnectionStringName);
                return Options.Create(new JCDbContextOptions() { ConnectionString = connectionString });
            };
            services.AddSingleton(optionsFactory);
            services.AddSingleton<JCDbContext, JCDbContext>();
            return services;
        }

        private static string GetConnectionString(IServiceProvider sp, string connectionStringName)
        {
            IConfiguration configuration = sp.GetService<IConfiguration>();
            string connectionString = configuration.GetConnectionString(connectionStringName);
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = Environment.GetEnvironmentVariable(connectionStringName);
            }
            return connectionString;
        }
    }
}
