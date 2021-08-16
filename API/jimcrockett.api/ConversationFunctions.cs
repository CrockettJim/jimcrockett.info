using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using jimcrockett.Data;
using jimcrockett.chat.Services;
using System.Linq;
using System.Collections.Generic;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using jimcrockett.chat.Types;

namespace jimcrockett.api
{
    public class ConversationFunctions
    {
        private readonly JCDbContext dbContext;
        private readonly UserIntentService chatService;
        public ConversationFunctions(JCDbContext jcdbContext, UserIntentService service)
        {
            dbContext = jcdbContext;
            chatService = service;
        }
        [Function("StartConversation")]
        public async Task<HttpResponseData> StartConversation([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger<ConversationFunctions>();
            string ipAddress = GetIpFromRequestHeaders(req);
            log.LogInformation($"Starting conversation with {ipAddress}");


            string id = Guid.NewGuid().ToString();
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = data?.id ?? id;

            dbContext.Logs.Add(id, ipAddress, "Started Conversation");

            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");
            response.WriteString(JsonConvert.SerializeObject(new
            {
                id = id,
                messages = new string[] {
                    "Feel free to type something to me."
                }
            }));

            return response;
        }

        [Function("SendMessage")]
        public async Task<HttpResponseData> SendMessage([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger<ConversationFunctions>();
            string ipAddress = GetIpFromRequestHeaders(req);
            log.LogInformation($"Received message from {ipAddress}");


            string id = Guid.NewGuid().ToString();
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = data?.id ?? id;
            string input = data?.userInput;
            if (!string.IsNullOrWhiteSpace(input)) { log.LogDebug($"User Input: {input}"); }
            string lastOutput = data?.lastOutput;
            if (!string.IsNullOrWhiteSpace(lastOutput)) { log.LogDebug($"Last Output: {lastOutput}"); }

            dbContext.Logs.Add(id, ipAddress, "Continuing Conversation", lastOutput, input);

            List<string> messages = new List<string>();
            Intent userIntent = await chatService.GetIntent(input);
            switch (userIntent)
            {
                case Intent.Code:
                    messages.Add("This site is made with Angular utilizing the MS LUIS engine.  The source code in GitHub is available at:");
                    messages.Add("<a href=\"https://github.com/CrockettJim/jimcrockett.info\" target=\"jcGitHub\">Site's GitHub</a>");
                    break;
                case Intent.Contact:
                    messages.Add("You can e-mail Jim at:");
                    messages.Add("<a href=\"mailto:the.jim.crockett@gmail.com\">the.jim.crockett@gmail.com</a>");
                    break;
                case Intent.Greeting:
                    messages.Add("Hello! Let me know what you want to know about Jim or this site.");
                    break;
                case Intent.Help:
                    messages.Add("I've got a few things that I can answer, like talking about Jim's LinkedIn, Pluralsight Profile, and Contact information.  Just type something to find out more.");
                    break;
                case Intent.LinkedIn:
                    messages.Add("You can view Jim's work history, skills and recommendations at:");
                    messages.Add("<a href=\"https://www.linkedin.com/in/crockettjim/\" target=\"jcLinkedIn\">LinkedIn Profile</a>");
                    break;
                case Intent.Pluralsight:
                    messages.Add("You can view Jim's skill assessments and Pluralsight profile at:");
                    messages.Add("<a href=\"https://app.pluralsight.com/profile/jim-crockett\" target=\"jcPluralsight\">Pluralsight Achievements</a>");
                    break;
                case Intent.None:
                default:
                    messages.Add("I'm limited with my responses.  For now, here are some helpful links:");
                    messages.Add("<a href=\"https://www.linkedin.com/in/crockettjim/\" target=\"jcLinkedIn\">LinkedIn Profile</a>");
                    messages.Add("<a href=\"https://app.pluralsight.com/profile/jim-crockett\" target=\"jcPluralsight\">Pluralsight Achievements</a>");
                    break;
            }


            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");
            response.WriteString(JsonConvert.SerializeObject(new
            {
                id = id,
                messages = messages.ToArray()
            }));

            return response;
        }

        [Function("EndConversation")]
        public async Task<HttpResponseData> EndConversation([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var log = executionContext.GetLogger<ConversationFunctions>();
            string ipAddress = GetIpFromRequestHeaders(req);
            log.LogInformation($"Ending conversation with {ipAddress}");


            string id = Guid.NewGuid().ToString();
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = data?.id ?? id;

            dbContext.Logs.Add(id, ipAddress, "Ended Conversation");


            var response = req.CreateResponse(System.Net.HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");
            response.WriteString(JsonConvert.SerializeObject(new
            {
                id = id,
                messages = new string[] {
                    "Goodbye"
                }
            }));

            return response;
        }
        private static string GetIpFromRequestHeaders(HttpRequestData request)
        {
            var forwardedFor = request.Headers.FirstOrDefault(_ => _.Key == "X-Forwarded-For");
            if (forwardedFor.Value == null) { return "unknown"; }

            return string.Join(",", forwardedFor.Value);
        }
    }
}
