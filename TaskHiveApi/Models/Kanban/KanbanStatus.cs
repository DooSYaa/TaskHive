namespace TaskHiveApi.Models.Kanban;

public class KanbanStatus
{
    public string Id { get; set; }
    public string KanbanTableId { get; set; }
    public KanbanTable KanbanTable { get; set; }
    public string StatusName { get; set; }
    public string Position { get; set; }
}