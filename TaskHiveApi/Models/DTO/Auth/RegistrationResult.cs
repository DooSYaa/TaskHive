using Microsoft.AspNetCore.Identity;

namespace TaskHiveApi.Models.DTO;

public class RegistrationResult
{
    public bool Succeeded { get; set; }
    public NewUserDto? User { get; set; }
    public IEnumerable<IdentityError>? Errors { get; set; }
}