using jimcrockett.chat;
using jimcrockett.Data;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(jimcrockett.api.Startup))]
namespace jimcrockett.api
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddData();
            builder.Services.AddChat();
        }
    }
}
