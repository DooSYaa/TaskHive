using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;

namespace TaskHiveApi.Controllers
{
    [Route("api/direct-messages")]
    [ApiController]
    public class DirectMessagesController : ControllerBase
    {
        private readonly IDirectMessagesSevice _directMessagesSevice;

        public DirectMessagesController(IDirectMessagesSevice directMessagesSevice)
        {
            _directMessagesSevice = directMessagesSevice;
        }
        [HttpGet("{friendId}")]
        public async Task<ActionResult> GetPrivateMessages(
            string friendId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 20)
        {
            if (string.IsNullOrEmpty(friendId))
                return BadRequest(new {message = "Something went wrong"});
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return BadRequest();
            var messages = await _directMessagesSevice.GetPrivateChatMessagesAsync(userId, friendId, offset, limit);
            if (messages == null)
                return BadRequest(new  {message = "Something went wrong. Messages not found"});
            return Ok(messages);
        }
    }
}
