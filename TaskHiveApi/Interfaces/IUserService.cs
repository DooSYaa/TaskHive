using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Interfaces;

public interface IUserService
{
    Task<UserDto> GetUserByIdAsync(string userId);
}