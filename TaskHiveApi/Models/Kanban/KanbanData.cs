namespace TaskHiveApi.Models.Kanban;

public class KanbanData
{
    public string Id { get; set; }
    public string KanbanTableId { get; set; }
    public KanbanTable KanbanTable { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string KanbanStatusId { get; set; }
    public KanbanStatus KanbanStatus { get; set; }
}