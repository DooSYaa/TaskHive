using Microsoft.AspNetCore.Identity;

namespace TaskHiveApi.Models;

public class User : IdentityUser
{
   public string FirstName { get; set; }
   public string LastName { get; set; }
   public string? AvatarUrl { get; set; }
   public List<Friend> Friends { get; set; }
   public List<GroupUser> GroupUsers { get; set; } = new();
}