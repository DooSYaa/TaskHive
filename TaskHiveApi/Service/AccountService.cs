using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Service;

public class AccountService : IAccountService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IJwtService _jwtService;

    public AccountService(UserManager<User> userManager, SignInManager<User> signInManager,IJwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
    }
    public async Task<UserDto> GetUserByIdAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;
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

    public async Task<RegistrationResult> RegisterAsync(RegisterDto userDto)
    {
        var newUser = new User
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            UserName = userDto.UserName,
            Email = userDto.Email,
        };
        var createdUser = await _userManager.CreateAsync(newUser, userDto.Password);
        if (!createdUser.Succeeded)
        {
            return new RegistrationResult
            {
                Succeeded = false,
                Errors = createdUser.Errors,
            };
        }

        var newUserDto = new NewUserDto
        {
            Id = newUser.Id,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            UserName = newUser.UserName,
            Email = newUser.Email,
            Token = _jwtService.GenerateJwtToken(newUser)
        };
        return new RegistrationResult
        {
            Succeeded = true,
            User = newUserDto,
        };
    }

    public async Task<LoginResult> LoginAsync(LoginDto userDto)
    {
        var user = await _userManager.FindByEmailAsync(userDto.Email);
        if (user == null)
            return new LoginResult
            {
                Succeeded = false,
            };
        var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);
        if (result.IsLockedOut)
            return new LoginResult
            {
                IsLockedOut = true,
            };
        
        return new LoginResult
        {
            Succeeded = true,
            User = new LoginUserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl,
                Token = _jwtService.GenerateJwtToken(user),
            }
        };
    }
}