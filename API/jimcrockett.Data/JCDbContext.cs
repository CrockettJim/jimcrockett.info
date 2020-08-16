using System;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Azure.Documents;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace jimcrockett.Data
{
    public class JCDbContextOptions
    {
        public string ConnectionString { get; set; }
    }
    public class JCDbContext
    {
        public JCDbContext(ILogger<JCDbContext> logger, IOptions<JCDbContextOptions> options)
        {
            CloudStorageAccount storageAccount = GetStorageAccount(logger, options.Value.ConnectionString);
            Connection = storageAccount.CreateCloudTableClient();

            Logs = new Logs(this);
        }
        public CloudTableClient Connection { get; set; }
        public Logs Logs { get; }

        private static CloudStorageAccount GetStorageAccount(ILogger<JCDbContext> logger, string connectionString)
        {
            CloudStorageAccount storageAccount;
            try
            {
                storageAccount = CloudStorageAccount.Parse(connectionString);
            }
            catch (FormatException e)
            {
                logger.LogError(e, "Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the application.");
                throw;
            }
            catch (ArgumentException e)
            {
                logger.LogError(e, "Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the sample.");
                throw;
            }
            return storageAccount;
        }
    }
}
