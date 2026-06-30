using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO;

namespace TaskHiveApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{ 
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    [HttpPost("registration")]
    public async Task<IActionResult> Registration([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _authService.RegisterAsync(registerDto);
            if(!result.Succeeded) return BadRequest(result.Errors);
            return Ok(result.User);
        }
        catch
        {
            return StatusCode(500, "An error occurred during registration.");
        }
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
                var result = await _authService.LoginAsync(loginDto);
                if (result.IsLockedOut) return StatusCode(423, "Account is locked. Please try again later.");
                if (!result.Succeeded)
                    return Unauthorized("Incorrect login or password.");
            return Ok(result.User);
        }
        catch
        {
            return StatusCode(500, "An error occurred during login.");
        }
    }
    // logout будет закоментирован потому-что он по идее тут не нужен. если со временем не верну то удалить!
    // [Authorize]
    // [HttpPost("logout")]
    // public IActionResult Logout()
    // {
    //     return Ok();
    // }
    // [Authorize]
    // [HttpDelete("user")]
    // public async Task<IActionResult> DeleteUser()
    // {
    //     var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    //     if (string.IsNullOrEmpty(userId))
    //         return Unauthorized();
    //     var result = await _authService.DeleteUserAsync(userId);
    //     if (result == null)
    //         return NotFound(new { Message = "User not found" });
    //     if (!result.Succeeded)
    //     {
    //         var errors = result.Errors.Select(e => e.Description);
    //         return BadRequest(new { Message = "Не удалось удалить пользователя.", Errors = errors });
    //     }
    //     return NoContent();
    // }
}