using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;

namespace TaskHiveApi.Controllers
{
    [Route("api/friends")]
    [Authorize]
    [ApiController]
    public class FriendsController : ControllerBase
    {
        private readonly IFriendService _friendService;
        private readonly ILogger<FriendsController> _logger;
        public FriendsController(IFriendService friendService, ILogger<FriendsController> logger)
        {
            _friendService = friendService;
            _logger = logger;
        }
        [HttpGet]
        public async Task<IActionResult> GetFriend()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            var friends = await _friendService.GetFriendsListAsync(userId);
            return Ok(friends);
        }
        [HttpGet("{friendId}")]
        public async Task<IActionResult> GetFriends(string friendId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not found in token");
            var friend = await _friendService.GetFriendAsync(userId, friendId);
            
            return Ok(friend);
        }
        [HttpPost]
        public async Task<IActionResult> AddFriend([FromBody] string friendUserName)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(friendUserName))
                return BadRequest();
            var result = await _friendService.SendFriendRequestAsync(userId, friendUserName);
            if (!result)
                return BadRequest();
            return Ok(new {message = "Friend added"});
        }
        [HttpGet("requests")]
        public async Task<IActionResult> GetFriendsRequest()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            var friendsRequests = await _friendService.GetFriendRequestsAsync(userId);
            if (friendsRequests == null)
                return BadRequest();
            return Ok(friendsRequests);
        }
    }
}
