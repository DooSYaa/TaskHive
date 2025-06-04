using Microsoft.AspNetCore.Identity;

namespace TaskHiveApi.Models;

public class User : IdentityUser
{
   public List<Friends> Friends { get; set; }
}