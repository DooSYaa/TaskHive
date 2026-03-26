using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.Chat
{
    public class GroupMessage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string GroupId { get; set; }
        public virtual Group Group { get; set; }
        public string SenderId { get; set; }
        public virtual User Sender { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        // public bool IsSystemMessage { get; set; } = false;
    }
}