using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Models.DTO.GroupUser;

public class GroupUserDto
{
    public string? Id { get; set; }
    public string? UserName { get; set; }
    public GroupRole Role { get; set; }
}