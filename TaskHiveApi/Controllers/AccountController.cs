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
    private readonly IAccountService _accountService;
    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [HttpGet("get-user")]
    public async Task<IActionResult> GetUser([FromQuery] string? userId)
    {
        if (userId == null) return Unauthorized();
        var user = await _accountService.GetUserByIdAsync(userId);
        if (user == null) return NotFound("User not found.");
        return Ok(user);
    }

    [HttpPost("registration")]
    public async Task<IActionResult> Registration([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _accountService.RegisterAsync(registerDto);
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
                var result = await _accountService.LoginAsync(loginDto);
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
    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        return Ok();
    }
}