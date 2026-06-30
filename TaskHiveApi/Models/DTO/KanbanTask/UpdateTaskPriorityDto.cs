using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class UpdateTaskPriorityDto
    {
        public string GroupId { get; set; }
        public string KanbanId { get; set; }
        public string CardId { get; set; }
        public TaskPriority Priority { get; set; }
    }
}