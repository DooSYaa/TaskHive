using Microsoft.AspNetCore.Identity;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Interfaces;

public interface IAuthService
{
    Task<RegistrationResult> RegisterAsync(RegisterDto userDto);
    Task<LoginResult> LoginAsync(LoginDto userDto);
    // Task<IdentityResult?> DeleteUserAsync(string userId);
}