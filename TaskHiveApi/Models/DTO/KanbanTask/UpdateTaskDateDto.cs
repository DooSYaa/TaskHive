using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class UpdateTaskDateDto
    {
        public string GroupId { get; set; }
        public string KanbanId { get; set; }
        public string CardId { get; set; }
        public DateTime? DueDateTime { get; set; }
    }
}