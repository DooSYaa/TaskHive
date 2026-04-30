using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{ 
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly IJwtService _jwtService;
    private readonly ILogger<AccountController> _logger;
    public AccountController
    (
        UserManager<User> userManager, 
        SignInManager<User> signInManager, 
        IConfiguration configuration,
        IJwtService jwtService,
        ILogger<AccountController> logger
    )
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
        _jwtService = jwtService;
        _logger = logger;
    }

    [HttpGet("get-user")]
    public async Task<IActionResult> GetUser([FromQuery] string? userId)
    {
        if (userId == null) return Unauthorized();
        
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound("User not found.");

        return Ok(new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            AvatarUrl = user.AvatarUrl
        });
    }

    [HttpPost("registration")]
    public async Task<IActionResult> Registration([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };
            var createdUser = await _userManager.CreateAsync(user, registerDto.Password);
            if (!createdUser.Succeeded) return BadRequest(createdUser.Errors);
            return Ok( new NewUserDto
                {
                    Id = user.Id, 
                    FirstName = user.FirstName, 
                    LastName = user.LastName, 
                    UserName = user.UserName, 
                    Email = user.Email, 
                    Token = _jwtService.GenerateJwtToken(user),
                }
            );
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred during registration.");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user != null)
        {
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                var token = _jwtService.GenerateJwtToken(user);
                return Ok(new LoginUserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName,
                    Email = user.Email,
                    AvatarUrl = user.AvatarUrl,
                    Token = token
                });
            }
            if (result.IsLockedOut) return StatusCode(423, "Account is locked. Please try again later.");
        }
        return Unauthorized("Invalid email or password.");
    }
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}