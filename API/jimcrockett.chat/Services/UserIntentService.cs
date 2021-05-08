using jimcrockett.chat.Types;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Net.Http;
using System.Threading.Tasks;

namespace jimcrockett.chat.Services
{
    public class UserIntentOptions
    {
        public string LUISAppId { get; set; }
        public string LUISSubscriptionKey { get; set; }
        public string LUISUri { get; set; }
    }
    public class UserIntentService
    {
        private readonly ILogger<UserIntentService> _logger;
        private readonly UserIntentOptions _options;
        public UserIntentService(ILogger<UserIntentService> logger, IOptions<UserIntentOptions> options)
        {
            _logger = logger;
            _options = options.Value;
        }
        public async Task<Intent> GetIntent(string utteredText)
        {
            _logger.LogInformation("Received input: " + utteredText);
            string luisPrediction = await CallLUISforIntent(utteredText);
            _logger.LogInformation("Retrieved from LUIS: " + luisPrediction);
            var prediction = JsonConvert.DeserializeObject<dynamic>(luisPrediction);

            Intent predictedIntent = Intent.None;
            Enum.TryParse<Intent>(prediction?.prediction?.topIntent?.ToString() ?? "", out predictedIntent);
            _logger.LogInformation("Parsed intent: " + predictedIntent.ToString());
            return predictedIntent;
        }
        private async Task<string> CallLUISforIntent(string utterance)
        {
            var queryString = CreateQueryString(utterance);
            var uri = _options.LUISUri + "/luis/prediction/v3.0/apps/" + _options.LUISAppId + "/slots/production/predict?" + queryString;
            var response = await new HttpClient().GetAsync(uri);
            return await response.Content.ReadAsStringAsync();
        }
        private NameValueCollection CreateQueryString(string utterance)
        {
            var queryString = System.Web.HttpUtility.ParseQueryString(string.Empty);
            queryString["query"] = utterance;
            queryString["log"] = "true";
            queryString["subscription-key"] = _options.LUISSubscriptionKey;
            queryString["verbose"] = "true";
            queryString["show-all-intents"] = "true";
            return queryString;
        }
    }
}
