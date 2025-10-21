namespace TaskHiveApi.Models.Kanban;

public class KanbanTable
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string KanbanTableName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Group Group { get; set; }
    public List<KanbanStatus> Statuses { get; set; } = new List<KanbanStatus>();
    public List<KanbanData> Cards { get; set; } = new List<KanbanData>();
}