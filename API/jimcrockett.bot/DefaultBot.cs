// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using jimcrockett.chat.Services;
using jimcrockett.chat.Types;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Logging;

namespace jimcrockett.bot
{
    public class DefaultBot: ActivityHandler
    {
        public DefaultBot()
        {
        }
        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            foreach (var member in membersAdded)
            {
                // Greet anyone that was not the target (recipient) of this message.
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await turnContext.SendActivityAsync($"Welcome to Jim's Website");
                    await turnContext.SendActivityAsync($"Please type something to me.");
                }
            }
        }
        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var intent = UserIntentService.DetermineIntent(turnContext.Activity.Text);
            switch (intent)
            {
                case Intent.Greeting:
                    await turnContext.SendActivityAsync($"Why, hello. Pleasure to meet you.");
                    break;
                case Intent.LinkedIn:
                    await turnContext.SendActivityAsync($"Sure, visit my [LinkedIn](https://www.linkedin.com/in/crockettjim/).");
                    break;
                default:
                    await turnContext.SendActivityAsync($"You're talking crazy and I can't understand a word you're saying.");
                    break;
            }
        }
    }
}
