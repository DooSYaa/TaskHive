using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Service;

public class AccountService : IAccountService
{
    private readonly UserManager<User>  _userManager;

    public AccountService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }
    public async Task<UserDto> GetMeAsync(string? userId)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
            return null;
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl,
        };
    }
    // В будущем добавить удаление контроллера
}