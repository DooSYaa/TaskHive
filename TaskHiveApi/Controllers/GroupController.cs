using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GroupController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateGroup")]
        public async Task<IActionResult> CreateGroup([FromBody] CreateGroupDto createGroupDto)
        {
            var userId = User?.Identity?.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            
            // var groupList = _context.Users
            //     .Include(g => g.Groups)
            //     .Select(g => new GroupWithUserDto
            //     {
            //         UserName = user.UserName,
            //         GroupName = g.Groups.Select(g => g.GroupName).ToList()
            //     });
            // var containsGroupName = groupList.FirstOrDefault(g => g.GroupName.Contains(createGroupDto.GroupName));
            // if (containsGroupName != null)
            //     return BadRequest(new { message = "Group already exists" });
            //
            var newGroup = new Group
            {
                GroupName = createGroupDto.GroupName,
            };
            newGroup.GroupUsers.Add(new GroupUser
            {
                UserId = user.Id,
                Role = GroupRole.Admin
            });
            
            await _context.Groups.AddAsync(newGroup);
            await _context.SaveChangesAsync();
            
            return Ok(new
            {
                newGroup.Id,
                newGroup.GroupName,
                AdminId = user.Id
            });
        }
        [HttpGet("getMyGroups")]
        public async Task<IActionResult> GetMyGroups()
        {
            var userName = User?.Identity?.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            var groups = await _context.Groups
                .AsNoTracking()
                .Where(u => u.GroupUsers.Any(x => x.UserId == user.Id))
                .Include(gu => gu.GroupUsers)
                .ThenInclude(u => u.User)
                .ToListAsync();

            var result = groups.Select(g => new
            {
                Id = g.Id,
                Name = g.GroupName,
                Users = g.GroupUsers.Select(gu => new
                {
                    userId = gu.UserId,
                    UserName = gu.User.UserName,
                    Role = gu.Role
                }).ToList()
            });
            return Ok(result);
        }

        [HttpPost("AddUserToGroup")]
        public async Task<IActionResult> AddUserToGroup([FromBody] AddUserToGroupDto addUserToGroupDto)
        {
            var userName = User?.Identity?.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null)
                return Unauthorized(new { message = "User not found" });
            
            var friend = await _context.Users.FirstOrDefaultAsync(u => u.UserName == addUserToGroupDto.friendName);
            if(friend == null)
                return NotFound(new { message = "Friend not found" });

            bool isFriend = await _context.Friends
                .AnyAsync(u => u.UserId == user.Id &&
                          u.FriendId == friend.Id);
            if(!isFriend)
                return BadRequest(new { message = "User not your friend" });

            var group = await _context.Groups
                .FirstOrDefaultAsync(u => u.GroupUsers
                    .Any(x => x.UserId == user.Id &&
                              x.Group.GroupName == addUserToGroupDto.groupName));
            if(group == null)
                return NotFound(new { message = "Group not found" });
            
            var isUserInGroup = await _context.GroupUsers.AnyAsync(u => u.GroupId == group.Id && u.UserId == friend.Id);
            if (isUserInGroup)
                return BadRequest(new { message = "User is already in group" });
            
            group.GroupUsers.Add(new GroupUser
            {
                GroupId = group.Id,
                UserId = friend.Id,
                Role = GroupRole.User
            });
            await _context.SaveChangesAsync();
            return Ok(new { message = "User successfully added to group" });
        }
    }
}
