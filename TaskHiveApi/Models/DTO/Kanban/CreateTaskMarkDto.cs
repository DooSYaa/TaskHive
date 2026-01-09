using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class CreateTaskMarkDto
    {
        public string MarkName { get; set; } = string.Empty;
        public string HexColor { get; set; } = string.Empty;
        public string GroupId { get; set; }
        public string KanbanId { get; set; }
    }
}