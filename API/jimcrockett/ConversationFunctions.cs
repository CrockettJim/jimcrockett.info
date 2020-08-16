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

namespace jimcrockett
{
    public class ConversationFunctions
    {
        private readonly JCDbContext dbContext;
        public ConversationFunctions(JCDbContext jcdbContext)
        {
            dbContext = jcdbContext;
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
            if (lastOutput == "What's your name?")
            {
                messages.Add($"Good to meet you, {input}.");
            }
            else if (new string[] { "hello", "hi", "howdy", "hey" }.Contains(input.ToLower().Trim()))
            {
                messages.Add("Hello!");
                messages.Add("What's your name?");
            }
            else
            {
                messages.Add("I'm limited with my responses.  For now, here are some helpful links:");
                messages.Add("<a href=\"https://www.linkedin.com/in/crockettjim/\" target=\"jcLinkedIn\">My LinkedIn</a>");
                messages.Add("<a href=\"https://app.pluralsight.com/profile/jim-crockett-76\" target=\"jcPluralsight\">My Pluralsight Achievements</a>");
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
