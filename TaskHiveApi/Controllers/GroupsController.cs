using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Controllers
{
    [Authorize]
    [Route("api/groups")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupsService _groupsService;

        public GroupsController(IGroupsService groupsService)
        {
            _groupsService = groupsService;
        }
        [HttpGet]
        public async Task<IActionResult> GetMyGroups()
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var groups = await _groupsService.GetGroupsAsync(userId);
            if (groups == null)
                return NotFound();
            
            return Ok(groups);
        }
        [HttpPost]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto createGroupDto)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            var result = await _groupsService.CreateGroupAsync(userId, createGroupDto);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }

        [HttpPost($"AddUserToGroup")]
        public async Task<IActionResult> AddUserToGroup([FromBody] AddUserToGroupDto addUserToGroupDto)
        {
            var userId =  User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();
            var result = await _groupsService.AddUserToGroupAsync(userId, addUserToGroupDto);
            if (result == null)
                return BadRequest();
            return Created(nameof(AddUserToGroup), result);
        }
        // [HttpGet("GetGroupUsers")]
        // public async Task<IActionResult> GetGroupUsers([FromQuery] GetGroupUsersDto groupUsersDto)
        // {
        //     var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        //     var existingGroup = await _context.Groups
        //         .Include(x => x.GroupUsers)
        //         .ThenInclude(u => u.User)
        //         .FirstOrDefaultAsync(x => x.Id == groupUsersDto.groupId);
        //     if (existingGroup == null)
        //         return NotFound("Group not found");
        //
        //     var isMember = existingGroup.GroupUsers.Any(x => x.UserId == currentUserId);
        //     if (!isMember)
        //         return Forbid();
        //
        //     var groupUsers = existingGroup.GroupUsers.Select(x => new
        //     {
        //         x.UserId,
        //         x.User.FirstName,
        //         x.User.LastName,
        //         x.User.UserName,
        //         x.User.AvatarUrl,
        //         userRole = x.Role.ToString(),
        //     });
        //     return Ok(groupUsers);
        // }
    }
}
