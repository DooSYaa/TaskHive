namespace TaskHiveApi.Models.DTO.Kanban;

public class CreateKanbanTableDto
{
    public string KanbanTableName { get; set; } = string.Empty;
    public string GroupId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}