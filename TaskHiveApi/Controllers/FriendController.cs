using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Models;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FriendController> _logger;
        public FriendController(ApplicationDbContext context, ILogger<FriendController> logger)
        {
            _context = context;
            _logger = logger;
        }
        [HttpGet("getFriends")]
        public async Task<IActionResult> GetFriends()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            _logger.LogInformation($"userId: {userId}, \n {DateTime.Now}");
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found in token");
            }
            var friends = await _context.Friends
                .Where(f => f.UserId == userId && f.Status == Status.Accepted)
                .Select(f => f.Friend.UserName)
                .ToListAsync();
            
            return Ok(friends);
        }
        [Authorize]
        [HttpPost("addFriend")]
        public async Task<IActionResult> AddFriend([FromBody] string friendName)
        {
            var friend = await _context.Users.FirstOrDefaultAsync(f => f.UserName == friendName);
            var userName = User.FindFirstValue(ClaimTypes.Name);
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            
            if (friend == null)
                return NotFound(friendName);
            if (currentUser == null)
                return NotFound(currentUser);
            var existingRecord = await _context.Friends.FirstOrDefaultAsync(f => (f.UserId == currentUser.Id &&
                                                                             f.FriendId == friend.Id &&
                                                                             f.Status == Status.Pending) || 
                                                                            (f.UserId == friend.Id && 
                                                                             f.FriendId == currentUser.Id &&
                                                                             f.Status == Status.Pending)
                                                                            );
            if (existingRecord != null)
            {
                existingRecord.Status = Status.Accepted;
                var newFriend = new Friends
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = currentUser.Id,
                    FriendId = friend.Id,
                    Status = Status.Accepted
                };
                _context.Update(existingRecord);
                await _context.Friends.AddAsync(newFriend);
                await _context.SaveChangesAsync();
                return Ok(new {message = "Friend added"});
            }
            else
            {
                var q = new Friends
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = currentUser.Id,
                    FriendId = friend.Id,
                    Status = Status.Pending
                };
                await _context.Friends.AddAsync(q);
                await _context.SaveChangesAsync();
                return Ok(new {message = "Friend added. Wait for answer"});
            }
        }
        [Authorize]
        [HttpGet("getFriendsRequest")]
        public async Task<IActionResult> GetFriendsRequest()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var friendsRequests = _context.Friends.Where(f => f.FriendId == userId &&
                                                              f.Status == Status.Pending)
                .Select(f => f.User.UserName);
            return Ok(friendsRequests);
        }
    }
}
