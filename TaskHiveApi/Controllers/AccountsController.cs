using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;

namespace TaskHiveApi.Controllers;

[Authorize]
[ApiController]
[Route("api/account")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }
    [HttpGet("me")]
    public async Task<IActionResult> GetMeAsync()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();
        var user = await _accountService.GetMeAsync(userId);
        if (user == null)
            return NotFound(new { Message = "User not found" });
        return Ok(user);
    }
}