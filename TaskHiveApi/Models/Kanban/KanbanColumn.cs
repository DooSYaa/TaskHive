namespace TaskHiveApi.Models.Kanban;

public class KanbanColumn
{
    public string? Id { get; set; } = $"column-{Guid.NewGuid()}";
    public string? KanbanBoardId { get; set; }
    public KanbanBoard KanbanBoard { get; set; } = null!;
    // public string StatusName { get; set; }
    public string ColumnName { get; set; }
    public int Position { get; set; }
    public List<KanbanTask> Cards { get; set; } = new List<KanbanTask>();
}