using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Interfaces;

public interface IAccountService
{
    Task<UserDto> GetMeAsync(string? userId);
}