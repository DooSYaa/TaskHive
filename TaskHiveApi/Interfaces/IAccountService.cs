using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Interfaces;

public interface IAccountService
{
    Task<UserDto> GetUserByIdAsync(string userId);
    Task<RegistrationResult> RegisterAsync(RegisterDto userDto);
    Task<LoginResult> LoginAsync(LoginDto userDto);
}