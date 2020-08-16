using Microsoft.Azure.Cosmos.Table;

namespace jimcrockett.Data
{
    public class Logs
    {
        private readonly CloudTable tableReference;
        public Logs(JCDbContext context)
        {
            tableReference = context.Connection.GetTableReference(Entities.UserInputLog.TableName);
        }
        public void Add(string sessionId, string ipAddress, string details = null, string lastLineOutput = null, string userInput = null)
        {
            var entity = new Entities.UserInputLog(sessionId)
            {
                IpAddress = ipAddress,
                Details = details,
                LastLineOutput = lastLineOutput,
                UserInput = userInput
            };
            TableOperation insertOperation = TableOperation.InsertOrMerge(entity);
            tableReference.Execute(insertOperation);
        }
    }
}
