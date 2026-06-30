using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Kanban;

namespace TaskHiveApi.Controllers
{
    [Route("api/kanban-columns")]
    [ApiController]
    public class KanbanColumnsController : ControllerBase
    {
        private readonly IKanbanColumnService _kanbanColumnService;

        public KanbanColumnsController(IKanbanColumnService kanbanColumnService)
        {
            _kanbanColumnService = kanbanColumnService;
        }
        [HttpGet("{kanbanBoardId}")]
        public async Task<IActionResult> Get(string kanbanBoardId)
        {
            if (string.IsNullOrEmpty(kanbanBoardId))
                return BadRequest();
            var result = await _kanbanColumnService.GetKanbanColumns(kanbanBoardId);
            return Ok(result);
        }
        [HttpPost("{kanbanBoardId}")]
        public async Task<IActionResult> CreateKanbanColumn(
            [FromQuery] string kanbanBoardId,
            [FromBody] CreateKanbanBlockDto kanbanBlockDto)
        {
            if (string.IsNullOrEmpty(kanbanBoardId))
                return BadRequest();
            var newKanbanColumn = await _kanbanColumnService.CreateKanbanColumnAsync(kanbanBoardId, kanbanBlockDto);
            if (newKanbanColumn == null)
                return NotFound("Column not found!");
            return Ok(newKanbanColumn);
        }
        [HttpPut("{kanbanColumnId}/move")]
        public async Task<IActionResult> MoveColumn(
            string kanbanColumnId,
            [FromBody] MoveColumnDto columnDto)
        {
            var result = await _kanbanColumnService
                .MoveKanbanColumnAsync(kanbanColumnId, columnDto.position);
            if (!result)
                return BadRequest();
            return Ok("Success!");
        }
        [HttpDelete("{kanbanColumnId}")]
        public async Task<IActionResult> DeleteKanbanColumn(string kanbanColumnId)
        {
            if (string.IsNullOrEmpty(kanbanColumnId))
                return BadRequest();
            var isCardDeleted = await _kanbanColumnService.DeleteKanbanColumnAsync(kanbanColumnId);
            if (!isCardDeleted)
                return BadRequest();
            return NoContent();
        }
    }
}
