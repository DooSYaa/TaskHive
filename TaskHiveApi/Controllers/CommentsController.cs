using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;

namespace TaskHiveApi.Controllers
{
    [Route("api/tasks/{taskId}/comments")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentsService _commentsService;

        public CommentsController(ICommentsService commentsService)
        {
            _commentsService = commentsService;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments(
            string taskId,
            [FromQuery] int offset = 0,
            [FromQuery] int limit = 20)
        {
            if (string.IsNullOrEmpty(taskId))
                return BadRequest();
            var comments = await _commentsService.GetComments(taskId, offset, limit);
            if (comments == null)
                return NotFound();
            return Ok(comments);
        }
    }
}
