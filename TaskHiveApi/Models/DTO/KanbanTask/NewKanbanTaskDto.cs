namespace TaskHiveApi.Models.DTO.Kanban;

public class NewKanbanTaskDto
{
    public string Id { get; set; }
    public string KanbanBoardId { get; set; }
    public string KanbanColumnId { get; set; }
    public string Title { get; set; }
    public DateTime CreatedAt { get; set; }
}