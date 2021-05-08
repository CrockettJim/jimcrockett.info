using jimcrockett.chat.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;

namespace jimcrockett.chat
{
    public static class Startup
    {
        private static readonly string LuisAppId = "LUISAppId";
        private static readonly string LuisSubscriptionKey = "LUISSubscriptionKey";
        private static readonly string LuisUri = "LUISUri";
        public static IServiceCollection AddChat(this IServiceCollection services)
        {
            Func<IServiceProvider, IOptions<UserIntentOptions>> optionsFactory = (sp) =>
            {
                string appId = GetConfiguration(sp, Startup.LuisAppId);
                string uri = GetConfiguration(sp, Startup.LuisUri);
                string subKey = GetConfiguration(sp, Startup.LuisSubscriptionKey);
                return Options.Create(new UserIntentOptions() { LUISAppId = appId, LUISUri = uri, LUISSubscriptionKey = subKey });
            };
            services.AddSingleton(optionsFactory);
            services.AddSingleton<UserIntentService, UserIntentService>();
            return services;
        }

        private static string GetConfiguration(IServiceProvider sp, string configurationName)
        {
            IConfiguration configuration = sp.GetService<IConfiguration>();
            string configurationValue = configuration.GetSection(configurationName)?.Value;
            if (string.IsNullOrWhiteSpace(configurationValue))
            {
                configurationValue = Environment.GetEnvironmentVariable(configurationValue);
            }
            return configurationValue;
        }
    }
}
