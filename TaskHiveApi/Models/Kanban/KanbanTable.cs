namespace TaskHiveApi.Models.Kanban;

public class KanbanTable
{
    public string Id { get; set; }
    public string KanbanTableName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public Group Group { get; set; }
}