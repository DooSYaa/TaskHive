using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Controllers;
[Authorize]
[Route("api/[controller]")]
public class KanbanController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public KanbanController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("GetKanbanTables")]
    public IActionResult GetKanbanTables([FromQuery] GetKanbanTablesDto id)
    {
        var kanbanTables = _context.KanbanTables
            .Where(x => x.GroupId == id.groupId);
        return Ok(kanbanTables);
    }

    [HttpGet("GetCurrentKanbanTable")]
    public IActionResult GetCurrentKanbanTable([FromQuery] GetCurrentKanbanTableDto id)
    {
        var currentKanbanTable = _context.KanbanTables
            .Where(i => i.Id == id.kanbanId)
            .Include(ks => ks.Statuses)
            .ThenInclude(c => c.Cards)
            .FirstOrDefault();
        if (currentKanbanTable == null)
            return NotFound("Kanban not found");
        var newResult = new
        {
            Id = currentKanbanTable.Id,
            Statuses = currentKanbanTable.Statuses.Select(x => new
            {
                x.Id,
                x.StatusName,
                x.Position, 
                Cards = x.Cards.Select(x => new {
                    x.Id,
                    x.Title,
                    x.Description,
                }),
            }),
        };
        return Ok(newResult);
    }

    [HttpPost("CreateKanbanTable")]
    public IActionResult CreateKanbanTable([FromBody]CreateKanbanTableDto kanbanTableDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var kanbanTable = new KanbanTable
        {
            KanbanTableName = kanbanTableDto.KanbanTableName,
            GroupId = kanbanTableDto.GroupId,
        };
        _context.KanbanTables.Add(kanbanTable);
        _context.SaveChanges();

        var defaultStatuses = new List<KanbanStatus>
        {
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "To Do", Position = 0 },
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "Doing", Position = 1 },
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "Done", Position = 2 },
        };
        
        _context.KanbanStatuses.AddRange(defaultStatuses);
        _context.SaveChanges();
        
        return Ok(new
        {
            id = kanbanTableDto.GroupId,
            name = kanbanTableDto.KanbanTableName,
        });
    }
    [HttpPost("CreateKanbanCard")]
    public IActionResult CreateKanbanCard(
        [FromQuery] string kanbanTableId,
        [FromQuery] string kanbanStatusId,
        [FromBody] CreateKanbanCardDto kanbanCardDto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);
        var newKanbanCard = new KanbanData
        {
            KanbanTableId = kanbanTableId,
            KanbanStatusId = kanbanStatusId,
            Title = kanbanCardDto.Title,
        };
        _context.KanbanCards.Add(newKanbanCard);
        _context.SaveChanges();

        return Ok(new
        {
            id = newKanbanCard.Id,
            title = newKanbanCard.Title,
            description = newKanbanCard.Description,
        });
    }

    [HttpPut("MoveCard")]
    public IActionResult MoveCard(
        [FromBody] MoveKanbanCardDto kanbanCardDto
    )
    {
        var sourceColumn = _context.KanbanStatuses
            .Where(x => x.Id == kanbanCardDto.SourceKanbanBlockId)
            .Include(c => c.Cards)
            .FirstOrDefault();

        if (sourceColumn == null)
            return BadRequest("Kanban table not found");

        var card = sourceColumn.Cards
            .FirstOrDefault(x => x.Id == kanbanCardDto.KanbanCardId);

        if (card == null)
            return NotFound("Card not found");
        var targetColumn = _context.KanbanStatuses
            .Include(c => c.Cards)
            .FirstOrDefault(x => x.Id == kanbanCardDto.TargetKanbanBlockId);
        if (targetColumn == null)
            return NotFound("Target not found");
        sourceColumn.Cards.Remove(card);
        targetColumn.Cards.Add(card);
        _context.SaveChanges();

        return Ok("Success!");
    }

}