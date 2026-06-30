using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class MoveKanbanCardDto
    {
        public string? SourceKanbanColumnId { get; set; }
        public string? TargetKanbanColumnId { get; set; }
        public int Position { get; set; }
    }
}