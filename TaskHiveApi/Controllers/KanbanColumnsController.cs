using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Group;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

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
        [HttpGet("{groupId}/{kanbanBoardId}")]
        public async Task<IActionResult> Get(string groupId, string kanbanBoardId)
        {
            if (string.IsNullOrEmpty(groupId) || string.IsNullOrEmpty(kanbanBoardId))
                return BadRequest();
            var result = await _kanbanColumnService.GetKanbanColumns(groupId, kanbanBoardId);
            return Ok(result);
        }
        [HttpPost]
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
        [HttpPut]
        public async Task<IActionResult> MoveColumn(
            [FromBody] MoveColumnDto columnDto)
        {
            var result = await _kanbanColumnService
                .MoveKanbanColumnAsync(columnDto.kanbanTableId, columnDto.columnId, columnDto.position);
            if (!result)
                return BadRequest();
            return Ok("Success!");
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteKanbanColumn(string kanbanBoardId, [FromBody] string kanbanColumnId)
        {
            if (string.IsNullOrEmpty(kanbanBoardId))
                return BadRequest();
            var isCardDeleted = await _kanbanColumnService.DeleteKanbanColumnAsync(kanbanBoardId,  kanbanColumnId);
            if (!isCardDeleted)
                return BadRequest();
            return NoContent();
        }

    }
}
