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
    public async Task<IActionResult> GetCurrentKanbanTable([FromQuery] GetCurrentKanbanTableDto id)
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
            Statuses = currentKanbanTable.Statuses
                .OrderBy(x => x.Position)
                .Select(x => new
                {
                    x.Id,
                    x.StatusName,
                    x.Position,
                }),
            Cards = currentKanbanTable.Cards
                .OrderBy(x => x.Position)
                .Select(x => new
                {
                    x.Id,
                    x.KanbanStatusId,
                    x.Title,
                    x.Description,
                    x.Position,
                }),
        };
        return Ok(newResult);
    }

    [HttpPost("CreateKanbanTable")]
    public async Task<IActionResult> CreateKanbanTable([FromBody]CreateKanbanTableDto kanbanTableDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var kanbanTable = new KanbanTable
        {
            KanbanTableName = kanbanTableDto.KanbanTableName,
            GroupId = kanbanTableDto.GroupId,
            CreatedAt = DateTime.Now,
        };

        await _context.KanbanTables.AddAsync(kanbanTable);
        await _context.SaveChangesAsync();

        var defaultStatuses = new List<KanbanStatus>
        {
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "To Do", Position = 0 },
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "Doing", Position = 1 },
            new KanbanStatus { KanbanTableId = kanbanTable.Id, StatusName = "Done", Position = 2 },
        };
        
        await _context.KanbanStatuses.AddRangeAsync(defaultStatuses);
        await _context.SaveChangesAsync();
        
        return Ok(new
        {
            id = kanbanTable.GroupId,
            name = kanbanTable.KanbanTableName,
            createdAt = kanbanTable.CreatedAt
        });
    }
    [HttpPost("CreateKanbanCard")]
    public async Task<IActionResult> CreateKanbanCard(
        [FromQuery] string kanbanTableId,
        [FromQuery] string kanbanStatusId,
        [FromBody] CreateKanbanCardDto kanbanCardDto)
    {
        if(!ModelState.IsValid)
            return BadRequest(ModelState);

        var lastCardPosition = await _context.KanbanCards
            .Where(x => x.KanbanTableId == kanbanTableId && x.KanbanStatusId == kanbanStatusId)
            .Select(x => (int?)x.Position)
            .MaxAsync() ?? -1;
        var newKanbanCard = new KanbanData
        {
            KanbanTableId = kanbanTableId,
            KanbanStatusId = kanbanStatusId,
            Title = kanbanCardDto.Title,
            Position = lastCardPosition + 1,
        };
        await _context.KanbanCards.AddAsync(newKanbanCard);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = newKanbanCard.Id,
            title = newKanbanCard.Title,
            description = newKanbanCard.Description,
            position = newKanbanCard.Position,
        });
    }

    [HttpPut("MoveCard")]
    public async Task<IActionResult> MoveCard(
        [FromBody] MoveKanbanCardDto kanbanCardDto
    )
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        var sourceColumn = await _context.KanbanStatuses
            .Include(c => c.Cards)
            .FirstOrDefaultAsync(x => x.Id == kanbanCardDto.SourceKanbanBlockId);
        if (sourceColumn == null)
            return BadRequest("Kanban table not found");

        var card = sourceColumn.Cards
            .FirstOrDefault(x => x.Id == kanbanCardDto.KanbanCardId);
        if (card == null)
            return NotFound("Card not found");
        
        var targetColumn = await _context.KanbanStatuses
            .Include(c => c.Cards)
            .FirstOrDefaultAsync(x => x.Id == kanbanCardDto.TargetKanbanBlockId);
        if (targetColumn == null)
            return NotFound("Target not found");

        if (kanbanCardDto.SourceKanbanBlockId == kanbanCardDto.TargetKanbanBlockId)
        {
            var cards = sourceColumn.Cards.OrderBy(c => c.Position).ToList();

            cards.Remove(card);
            var insertIndex = Math.Clamp(kanbanCardDto.Position, 0, cards.Count);
            cards.Insert(insertIndex, card);

            for (int i = 0; i < cards.Count; i++)
                cards[i].Position = i;

            await _context.SaveChangesAsync();
            return Ok("Success!");
        }
        sourceColumn.Cards.Remove(card);
        card.KanbanStatusId = kanbanCardDto.TargetKanbanBlockId;

        var targetCards = targetColumn.Cards.OrderBy(c => c.Position).ToList();
        var targetIndex = Math.Clamp(kanbanCardDto.Position - 1, 0, targetCards.Count);
        targetCards.Insert(targetIndex, card);

        for (int i = 0; i < targetCards.Count; i++)
            targetCards[i].Position = i;
        for (int i = 0; i < sourceColumn.Cards.Count; i++)
            sourceColumn.Cards[i].Position = i;

        await _context.SaveChangesAsync();

        return Ok("Success!");
    }

}