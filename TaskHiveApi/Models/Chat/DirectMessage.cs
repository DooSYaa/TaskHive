using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.Chat
{
    public class DirectMessage
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string SenderId { get; set; }
        public virtual User Sender { get; set; }
        public string ReceiverId { get; set; }
        public virtual User Receiver { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}