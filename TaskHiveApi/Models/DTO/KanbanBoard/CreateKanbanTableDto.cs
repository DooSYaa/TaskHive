namespace TaskHiveApi.Models.DTO.KanbanBoard;

public class CreateKanbanTableDto
{
    public string KanbanTableName { get; set; } = string.Empty; //body
    public DateTime CreatedAt { get; set; }
}