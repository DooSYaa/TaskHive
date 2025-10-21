using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Models;

public class Group
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string GroupName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public List<GroupUser> GroupUsers { get; set; } = new();
    public List<KanbanTable> KanbanTables { get; set; } = new();

}