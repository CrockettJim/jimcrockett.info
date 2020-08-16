using Microsoft.Azure.Cosmos.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace jimcrockett.Data.Entities
{
    public class UserInputLog: TableEntity
    {
        internal static readonly string TableName = "userInputLog";
        public UserInputLog(string sessionId, string logId = null)
        {
            this.LogId = logId ?? this.LogId;
            this.SessionId = sessionId;

            this.PartitionKey = this.SessionId;
            this.RowKey = this.LogId;
        }
        public string LogId { get; set; } = Guid.NewGuid().ToString();
        public string SessionId { get; set; }
        public string IpAddress { get; set; }
        public string Details { get; set; }
        public string LastLineOutput { get; set; }
        public string UserInput { get; set; }
    }
}
