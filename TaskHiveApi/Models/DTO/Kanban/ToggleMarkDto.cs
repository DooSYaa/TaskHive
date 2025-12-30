using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TaskHiveApi.Models.DTO.Kanban
{
    public class ToggleMarkDto
    {
        public string CardId { get; set; }
        public string MarkId { get; set; }
    }
}