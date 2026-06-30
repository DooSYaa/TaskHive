using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TaskHiveApi.Models.Kanban
{
    public class Mark
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string MarkName { get; set; } = string.Empty;
        public string HexColor { get; set; } = string.Empty;
        public string GroupId { get; set; }
        public string KanbanId { get; set; }
        [JsonIgnore] 
        public List<KanbanTask> Cards { get; set; } = new List<KanbanTask>();
    }
}