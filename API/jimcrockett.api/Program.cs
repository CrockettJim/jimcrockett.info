using jimcrockett.chat;
using jimcrockett.Data;
using System;
using System.Threading.Tasks;
using System.Diagnostics;
using Microsoft.Extensions.Hosting;

namespace jimcrockett.api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
#if DEBUG
            Debugger.Launch();
#endif
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(s =>
                {
                    s.AddData();
                    s.AddChat();
                })
                .Build();

            await host.RunAsync();
        }
    }
}
