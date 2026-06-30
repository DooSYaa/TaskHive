using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.DTO.KanbanBoard;

namespace TaskHiveApi.Controllers;

[Authorize]
[ApiController]
[Route("api/kanban-boards")]
public class KanbanBoardsController : ControllerBase
{
    private readonly IKanbanBoardService _kanbanBoardService;
    public KanbanBoardsController(IKanbanBoardService kanbanBoardService)
    {
        _kanbanBoardService = kanbanBoardService;
    }
    [HttpGet("{groupId}")]
    public async Task<IActionResult> GetKanbanBoards(string groupId)
    {
        if (string.IsNullOrEmpty(groupId))
            return BadRequest();
        var kanbanBoards = await _kanbanBoardService
            .GetBoardsAsync(groupId);
        if (kanbanBoards == null)
            return NotFound();
        return Ok(kanbanBoards);
    }
    [HttpGet("current/{kanbanId}")]
    public async Task<IActionResult> GetCurrentKanbanBoard(string kanbanId)
    {
        if  (string.IsNullOrEmpty(kanbanId))
            return BadRequest();
        var result = await _kanbanBoardService
            .GetBoardAsync(kanbanId);
        if (result == null)
            return NotFound();
        return Ok(result);
    }
    [HttpPost("{groupId}")]
    public async Task<IActionResult> CreateKanbanBoard(string groupId, [FromBody] CreateKanbanTableDto kanbanTableDto)
    {
        if (string.IsNullOrEmpty(groupId))
            return BadRequest();
        if (kanbanTableDto == null)
            return BadRequest();
        var createdKanbanBoard = await _kanbanBoardService.CreateBoardAsync(groupId, kanbanTableDto);
        if (createdKanbanBoard == null)
            return BadRequest();
        return Ok(createdKanbanBoard);
    }
    [HttpDelete("{kanbanId}")]
    public async Task<IActionResult> DeleteKanbanTable([FromBody] DeleteKanbanTableDto deleteKanbanTableDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();
        var result = await _kanbanBoardService.DeleteBoardAsync(userId, deleteKanbanTableDto);
        if (!result)
            return BadRequest(new { message = "Something went wrong" });
        return NoContent();
    }
}