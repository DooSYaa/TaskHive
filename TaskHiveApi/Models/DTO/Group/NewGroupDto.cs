using TaskHiveApi.Models.DTO.GroupUser;

namespace TaskHiveApi.Models.DTO.Group;

public class NewGroupDto
{
    public string? Id { get; set; }
    public string? GroupName { get; set; }
    public DateTime CreatedAt { get; set; }
    
}