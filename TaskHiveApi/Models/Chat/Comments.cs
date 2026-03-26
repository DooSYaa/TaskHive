using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Models.Chat
{
    public class Comment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string TaskId { get; set; }
        public virtual KanbanData Task { get; set; }
        public string UserId { get; set; }
        public virtual User User { get; set; }
        public string Message { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}