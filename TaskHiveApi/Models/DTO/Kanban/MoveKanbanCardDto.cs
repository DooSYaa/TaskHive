using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class MoveKanbanCardDto
    {
        public string SourceKanbanBlockId { get; set; }
        public string TargetKanbanBlockId { get; set; }
        public string KanbanCardId { get; set; }
        public int Position { get; set; }
    }
}