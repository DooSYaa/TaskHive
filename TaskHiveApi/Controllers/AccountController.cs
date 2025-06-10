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

    [HttpPost("registration")]
    public async Task<IActionResult> Registration([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };
            var createdUser = await _userManager.CreateAsync(user, registerDto.Password);
            if (!createdUser.Succeeded)
                return BadRequest(createdUser.Errors);
            var result = await _signInManager.PasswordSignInAsync(user, registerDto.Password, false, false);
            if (!result.Succeeded)
            {
                if (result.IsLockedOut)
                    return Unauthorized("Your account is locked out");
                if (result.IsNotAllowed)
                    return Unauthorized("You are not allowed to login");
                return Unauthorized("Invalid email or password");
            }
            return CreatedAtAction(nameof(Login), new {email = registerDto.Email},
                new NewUserDto {UserName = user.UserName, Email = user.Email, Token = _jwtService.GenerateJwtToken(user)});
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred during registration.");
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            _logger.LogCritical("Model state is invalid");
            return BadRequest(ModelState);
        }
        
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
            return NotFound(loginDto.Email);
        if (!await _userManager.CheckPasswordAsync(user, loginDto.Password))
            return Unauthorized("Invalid credentials");
        var token = _jwtService.GenerateJwtToken(user);

        return Ok(new NewUserDto
        {
            UserName = user.UserName, 
            Email = user.Email, 
            Token = token /*_jwtService.GenerateJwtToken(user)*/
        });
    }
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}