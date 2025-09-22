using Microsoft.AspNetCore.Identity;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Models;

public class GroupUser
{
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; }
    
    public string GroupId { get; set; } = string.Empty;
    public Group Group { get; set; }

    public GroupRole Role { get; set; }
    
}