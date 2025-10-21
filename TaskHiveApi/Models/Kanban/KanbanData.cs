namespace TaskHiveApi.Models.Kanban;

public class KanbanData
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string KanbanTableId { get; set; }
    public string KanbanStatusId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Position { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdateAt { get; set; }
    public KanbanTable KanbanTable { get; set; }
    public KanbanStatus KanbanStatus { get; set; }
}
  