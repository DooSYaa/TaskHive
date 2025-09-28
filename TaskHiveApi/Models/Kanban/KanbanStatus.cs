namespace TaskHiveApi.Models.Kanban;

public class KanbanStatus
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string KanbanTableId { get; set; }
    public KanbanTable KanbanTable { get; set; } = null!;
    public string StatusName { get; set; }
    public int Position { get; set; }

    public List<KanbanData> Cards { get; set; } = new List<KanbanData>();
}