using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO;

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
        [HttpGet("{groupId}/users")]
        public async Task<IActionResult> GetGroupUsers(string groupId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(groupId))
                return BadRequest();
            var result = await _groupsService.GetGroupUserAsync(userId, groupId);
            if (result == null)
                return NotFound();
            return Ok(result);
        }
    }
}
