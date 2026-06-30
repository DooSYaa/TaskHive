using TaskHiveApi.Models.DTO.GroupUser;

namespace TaskHiveApi.Models.DTO.Group;

public class GroupDto
{
    public string? Id { get; set; }
    public string? GroupName { get; set; }
    public List<GroupUserDto>? Users { get; set; }
    public DateTime CreatedAt { get; set; }
    
}