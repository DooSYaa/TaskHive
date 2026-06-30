namespace TaskHiveApi.Models.DTO.Kanban;

public class KanbanBoardDto
{
    public string? Id { get; set; }
    public string? KanbanBoardName { get; set; }
    public string GroupId { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}