using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Interfaces;

public interface IAccountService
{
    Task<UserDto> GetUserByIdAsync(string userId);
    Task<NewUserDto> RegisterUserAsync(RegisterDto userDto);
    Task<LoginUserDto> LoginUserAsync(LoginDto userDto);
}