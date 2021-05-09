using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using jimcrockett.Data;
using System.Linq;
using System.Collections.Generic;
using jimcrockett.chat.Services;
using jimcrockett.chat.Types;

namespace jimcrockett
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
        [FunctionName("StartConversation")]
        public async Task<IActionResult> StartConversation(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string ipAddress = req.HttpContext.Connection.RemoteIpAddress.ToString();
            log.LogInformation($"Starting conversation with {ipAddress}");


            string id = Guid.NewGuid().ToString();
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = data?.id ?? id;

            dbContext.Logs.Add(id, ipAddress, "Started Conversation");

            return new OkObjectResult(new
            {
                id = id,
                messages = new string[] {
                    "Feel free to type something to me."
                }
            });
        }

        [FunctionName("SendMessage")]
        public async Task<IActionResult> SendMessage(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string ipAddress = req.HttpContext.Connection.RemoteIpAddress.ToString();
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
                    messages.Add("<a href=\"https://app.pluralsight.com/profile/jim-crockett-76\" target=\"jcPluralsight\">Pluralsight Achievements</a>");
                    break;
            }

            return new OkObjectResult(new
            {
                id = id,
                messages = messages.ToArray()
            });
        }

        [FunctionName("EndConversation")]
        public async Task<IActionResult> EndConversation(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string ipAddress = req.HttpContext.Connection.RemoteIpAddress.ToString();
            log.LogInformation($"Ending conversation with {ipAddress}");


            string id = Guid.NewGuid().ToString();
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            id = data?.id ?? id;

            dbContext.Logs.Add(id, ipAddress, "Ended Conversation");

            return new OkObjectResult(new
            {
                id = id,
                messages = new string[] {
                    "Goodbye"
                }
            });
        }
    }
}
