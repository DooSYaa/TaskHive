using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;

namespace TaskHiveApi.Controllers
{
    [Route("api/group-messages")]
    [ApiController]
    public class GroupMessagesController : ControllerBase
    {
        private readonly IGroupMessagesService _groupMessagesService;

        public GroupMessagesController(IGroupMessagesService groupMessagesService)
        {
            _groupMessagesService = groupMessagesService;
        }

        [HttpGet("{groupId}")]
        public async Task<IActionResult> GetGroupMessages(
            string groupId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 20)
        {
            if (string.IsNullOrEmpty(groupId))
                return BadRequest(new {message = "Something went wrong"});
            var messages = await _groupMessagesService.GetGroupMessages(groupId, offset, limit);
            if (messages == null)
                return BadRequest(new {message = "Something went wrong"});
            return Ok(messages);
            
        }
    }
}
