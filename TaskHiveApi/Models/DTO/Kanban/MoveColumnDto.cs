using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class MoveColumnDto
    {
        public string kanbanTableId { get; set; }
        public string columnId { get; set; }
        public int position { get; set; }
    }
}