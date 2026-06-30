namespace TaskHiveApi.Models.Kanban;

public class KanbanBoard
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    // public string KanbanTableName { get; set; } = string.Empty;
    public string KanbanBoardName { get; set; }
    public string GroupId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Group Group { get; set; }
    public List<KanbanColumn> Columns { get; set; } = new List<KanbanColumn>();
    public List<KanbanTask> Tasks { get; set; } = new List<KanbanTask>();
}