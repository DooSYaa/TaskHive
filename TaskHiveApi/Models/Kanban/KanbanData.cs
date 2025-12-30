using System.ComponentModel.DataAnnotations.Schema;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Models.Kanban;

public class KanbanData
{
    public string Id { get; set; } = $"card-{Guid.NewGuid()}";
    public string KanbanTableId { get; set; }
    public string KanbanStatusId { get; set; }

    public string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Position { get; set; }

    public string? AssignedUserId {get; set;}
    [ForeignKey("AssignedUserId")]
    public User? AssignedUser {get; set;}

    public DateTime? DueDate {get; set;}

    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdateAt { get; set; }

    public KanbanTable KanbanTable { get; set; }
    public KanbanStatus KanbanStatus { get; set; }

    public List<Mark> Marks { get; set; } = new List<Mark>();
}
  