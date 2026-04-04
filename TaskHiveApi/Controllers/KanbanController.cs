using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
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
        var currentKanbanTable = await _context.KanbanTables
            .Where(i => i.Id == id.kanbanId)
            .Include(ks => ks.Statuses)
            .ThenInclude(c => c.Cards)
            .ThenInclude(m => m.Marks)
            .Include(ks => ks.Statuses)
            .ThenInclude(c => c.Cards)
            .ThenInclude(a => a.AssignedUser)
            .FirstOrDefaultAsync();
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
                    Cards = x.Cards
                        .OrderBy(x => x.Position)
                        .Select(x => new
                        {
                            x.Id,
                            x.KanbanStatusId,
                            x.Title,
                            x.Description,
                            x.Position,
                            x.DueDate,
                            x.Priority,
                            AssignedUser = x.AssignedUser != null ? new
                            {
                                Id = x.AssignedUser.Id,
                                UserName = x.AssignedUser.UserName,
                            } : null, 
                            Marks = x.Marks.Select(x => new
                            {
                                x.Id,
                                x.MarkName,
                                x.HexColor,
                            }).ToList()
                        }),
            }),
        };
        return Ok(newResult);
    }
    [HttpPost("CreateKanbanTable")]
    public async Task<IActionResult> CreateKanbanTable([FromBody] CreateKanbanTableDto kanbanTableDto)
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

    [HttpPost("CreateCanbanBlock")]
    public async Task<IActionResult> CreateCanbanBlock(
        [FromQuery] string kanbanTableId,
        [FromBody] CreateKanbanBlockDto kanbanBlockDto)
    {
        var kanbanTable = await _context.KanbanTables
            .FirstOrDefaultAsync(x => x.Id == kanbanTableId);
        if (kanbanTable == null)
            return NotFound("Kanban table is not found");

        var lastKanbanBlockPosition = await _context.KanbanStatuses
            .Where(x => x.KanbanTableId == kanbanTableId)
            .Select(x => (int?)x.Position)
            .MaxAsync() ?? -1;
        var newKanbanblock = new KanbanStatus
        {
            KanbanTableId = kanbanTableId,
            StatusName = kanbanBlockDto.kanbanBlockName,
            Position = lastKanbanBlockPosition + 1,
        };
        await _context.KanbanStatuses.AddAsync(newKanbanblock);
        await _context.SaveChangesAsync();
        return Ok( new
        {
            id = newKanbanblock.Id,
            kanbanTable = newKanbanblock.KanbanTableId,
            statusName = newKanbanblock.StatusName,
            position = newKanbanblock.Position,
        });
    }

    [HttpGet("GetMyTasks")]
    public async Task<IActionResult> GetMyTasks()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if(string.IsNullOrWhiteSpace(userId))
            return Unauthorized();
        
        var groupLists = await _context.GroupUsers
            .Where(x => x.UserId == userId)
            .Select(x => x.GroupId)
            .ToListAsync();
        var tasks = await _context.KanbanTables
            .Where(x => groupLists.Contains(x.GroupId))
            .SelectMany(x => x.Cards)
            .Where(card => card.AssignedUserId == userId)
            .Select(card => new
            {
                Id = card.Id,
                Title = card.Title,
                Description = card.Description,
                DueDate = card.DueDate,
                Priority = card.Priority,
                AssignedUserId = card.AssignedUserId,
                GroupName = card.KanbanTable.Group.GroupName,
                TableName = card.KanbanTable.KanbanTableName,
                StatusName = card.KanbanStatus.StatusName,
                GroupId = card.KanbanTable.GroupId,
                KanbanId = card.KanbanTable.Id,
                Marks = card.Marks.Select(x => new
                {
                    x.Id,
                    x.MarkName,
                    x.HexColor,
                }).ToList()
            })
            .OrderBy(t => t.DueDate == null)
            .ThenByDescending(t => t.DueDate < DateTime.Now)
            .ThenBy(t => t.DueDate)
            .ThenByDescending(t => t.Priority)
            .ToListAsync();
        return Ok(tasks);

    } 
    [HttpGet("GetMyGroupTasks")]
    public async Task<IActionResult> GetMyGroupTasks(GetMyGroupTasksDto getMyGroupTasksDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var tasks = await _context.KanbanTables
            .Where(x => x.GroupId == getMyGroupTasksDto.GroupId)
            .SelectMany(x => x.Cards)
            .Select(card => new
            {
                Id = card.Id,
                Title = card.Title,
                Description = card.Description,
                DueDate = card.DueDate,
                Priority = card.Priority,
                AssignedUserid = card.AssignedUserId,
                TableName = card.KanbanTable.KanbanTableName,
                StatusName = card.KanbanStatus.StatusName,
                GroupId = card.KanbanTable.GroupId,
                KanbanId = card.KanbanTable.Id,
                Marks = card.Marks.Select(m => new
                {
                    m.Id,
                    m.MarkName,
                    m.HexColor,
                }).ToList()
            })
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        return Ok(tasks);

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
            kanbanStatusId,
            title = newKanbanCard.Title,
            description = newKanbanCard.Description,
            position = newKanbanCard.Position,
        });
    }
    [HttpDelete("DeleteKanbanCard")]
    public async Task<IActionResult> DeleteKanbanCard([FromQuery] DeleteKanbanCardDto deleteKanbanCardDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        bool isUserInGroup =
            await _context.GroupUsers.AnyAsync(x => x.UserId == userId && x.GroupId == deleteKanbanCardDto.GroupId);

        if (!isUserInGroup)
            return Forbid();

        var card = await _context.KanbanCards.FirstOrDefaultAsync(x =>
            x.Id == deleteKanbanCardDto.CardId && 
            x.KanbanTableId == deleteKanbanCardDto.KanbanId &&
            x.KanbanTable.GroupId == deleteKanbanCardDto.GroupId);
        
        if (card == null)
            return NotFound(new { message = "Something went wrong, try again later" });
    
        _context.Remove(card);
        await _context.SaveChangesAsync();
        return Ok(new {message = "Deleted!"});
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

    [HttpPut("MoveColumn")]
    public async Task<IActionResult> MoveColumn(
        [FromBody] MoveColumnDto columnDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var sourceColumn = await _context.KanbanStatuses
            .FirstOrDefaultAsync(x => x.Id == columnDto.columnId && x.KanbanTableId == columnDto.kanbanTableId);
        if (sourceColumn == null)
            return NotFound("Column not found!");

        var columns = await _context.KanbanStatuses
            .Where(x => x.KanbanTableId == columnDto.kanbanTableId)
            .OrderBy(x => x.Position)
            .ToListAsync();
        columns.Remove(sourceColumn);
        var targetIndex = Math.Clamp(columnDto.position, 0, columns.Count);
        columns.Insert(targetIndex, sourceColumn);

        for (int i = 0; i < columns.Count(); i++)
        {
            columns[i].Position = i;
        }

        await _context.SaveChangesAsync();
        return Ok("Success!");
    }

    [HttpPatch]
    public async Task<IActionResult> UpdateTaskDescription([FromBody] UpdateTaskDescriptionDto updateTaskDescriptionDto)
    {
        var existKanban =
            await _context.KanbanTables.AnyAsync(x =>
                x.Id == updateTaskDescriptionDto.KanbanId && 
                x.GroupId == updateTaskDescriptionDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found");
        var existCard = await _context.KanbanCards
            .FirstOrDefaultAsync(x => x.KanbanTableId == updateTaskDescriptionDto.KanbanId &&
                                      x.Id == updateTaskDescriptionDto.CardId);
        if (existCard == null)
            return NotFound("Card not found");
        if (existCard.Description != updateTaskDescriptionDto.Description)
        {
            existCard.Description = updateTaskDescriptionDto.Description;
            await _context.SaveChangesAsync();
        }
        return Ok();
    }
    [HttpPatch("UpdateTaskDate")]
    public async Task<IActionResult> UpdateTaskDate([FromBody] UpdateTaskDateDto updateTaskDateDto)
    {
        Console.WriteLine($"Received UpdateTaskDateDto: {updateTaskDateDto.DueDateTime}");
        var existKanban =
            await _context.KanbanTables.AnyAsync(x =>
                x.Id == updateTaskDateDto.KanbanId && 
                x.GroupId == updateTaskDateDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found");
        var existCard = await _context.KanbanCards
            .FirstOrDefaultAsync(x => x.KanbanTableId == updateTaskDateDto.KanbanId &&
                                      x.Id == updateTaskDateDto.CardId);
        if (existCard == null)
            return NotFound("Card not found");

        existCard.DueDate = updateTaskDateDto.DueDateTime;
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPatch("UpdateTaskAssignedUser")]
    public async Task<IActionResult> UpdateTaskAssignedUser([FromBody] UpdateAssignedUserDto updateAssignedUserDto)
    {
        var existKanban =
            await _context.KanbanTables.AnyAsync(x =>
                x.Id == updateAssignedUserDto.KanbanId && 
                x.GroupId == updateAssignedUserDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found");
        var existCard = await _context.KanbanCards
            .FirstOrDefaultAsync(x => x.KanbanTableId == updateAssignedUserDto.KanbanId &&
                                      x.Id == updateAssignedUserDto.CardId);
        if (existCard == null)
            return NotFound("Card not found");
        if(updateAssignedUserDto.AssignedUserId != null)
        {
            var userExists = await _context.Users.AnyAsync(x => x.Id == updateAssignedUserDto.AssignedUserId);
            if (!userExists)
                return BadRequest("User not found");
        }
        existCard.AssignedUserId = updateAssignedUserDto.AssignedUserId;
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("UpdateTaskMarks")]
    public async Task<IActionResult> UpdateTaskMarks([FromBody] ToggleMarkDto toggleMarkDto)
    {
        var existKanban =
            await _context.KanbanTables.AnyAsync(x =>
                x.Id == toggleMarkDto.KanbanId && 
                x.GroupId == toggleMarkDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found");
        var existCard = await _context.KanbanCards
            .Include(x => x.Marks)
            .FirstOrDefaultAsync(x => x.KanbanTableId == toggleMarkDto.KanbanId &&
                                      x.Id == toggleMarkDto.CardId);
        if (existCard == null)
            return NotFound("Card not found");

        var existMark = await _context.Marks
            .FirstOrDefaultAsync(x => x.Id == toggleMarkDto.MarkId && 
                                      x.GroupId == toggleMarkDto.GroupId);
        if (existMark == null)
            return NotFound("Mark not found");
        
        if (!existCard.Marks.Any(m => m.Id == existMark.Id))
        {
            existCard.Marks.Add(existMark);
            await _context.SaveChangesAsync();
        }
        return Ok(new
        {
            existMark.Id,
            existMark.MarkName,
            existMark.HexColor,
            existMark.GroupId,
            existMark.KanbanId,
        });
    }

    [HttpPatch("RemoveTaskMarks")]
    public async Task<IActionResult> RemoveTaskMarks([FromBody] ToggleMarkDto toggleMarkDto)
    {
        var existKanban =
            await _context.KanbanTables.AnyAsync(x =>
                x.Id == toggleMarkDto.KanbanId && 
                x.GroupId == toggleMarkDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found");
        var existCard = await _context.KanbanCards
            .Include(x => x.Marks)
            .FirstOrDefaultAsync(x => x.KanbanTableId == toggleMarkDto.KanbanId &&
                                      x.Id == toggleMarkDto.CardId);
        if (existCard == null)
            return NotFound("Card not found");

        var markToRemove = existCard.Marks.FirstOrDefault(x => x.Id == toggleMarkDto.MarkId);
        if (markToRemove != null)
        {
            existCard.Marks.Remove(markToRemove);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            markToRemove.Id,
            markToRemove.MarkName,
            markToRemove.HexColor,
            markToRemove.GroupId,
            markToRemove.KanbanId,
        });
    }

    [HttpPatch("UpdateTaskPriority")]
    public async Task<IActionResult> UpdateTaskPriority([FromBody] UpdateTaskPriorityDto updateTaskPriorityDto)
    {
        var existKanban = await _context.KanbanTables
            .AnyAsync(x => x.Id == updateTaskPriorityDto.KanbanId && 
                           x.GroupId == updateTaskPriorityDto.GroupId);
        if (!existKanban)
            return NotFound("Kanban not found or not exist");
        var existCard = await _context.KanbanCards
            .FirstOrDefaultAsync(x => x.Id == updateTaskPriorityDto.CardId &&
                                    x.KanbanTableId == updateTaskPriorityDto.KanbanId);
        if (existCard == null)
            return NotFound("Card not found");

        if (existCard.Priority != updateTaskPriorityDto.Priority)
        {
            existCard.Priority = updateTaskPriorityDto.Priority;
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpGet("GetMarks")]
    public async Task<IActionResult> GetMarks([FromQuery] GetMarksDto getMarksDto)
    {
        var marks = _context.Marks.Where(x => x.GroupId == getMarksDto.GroupId && x.KanbanId == getMarksDto.KanbanId);
        return Ok(marks);
    }
    [HttpPost("CreateTaskMark")]
    public async Task<IActionResult> CreateTaskMark([FromBody] CreateTaskMarkDto createTaskMarkDto)
    {
        var isKanbanExist = await _context.KanbanTables.AnyAsync(x =>
            x.Id == createTaskMarkDto.KanbanId && 
            x.GroupId == createTaskMarkDto.GroupId);
        if (!isKanbanExist)
            return NotFound("Kanban not found");
        // 2. (Опционально) Проверка на дубликат имени в рамках этой доски
        var newMark = new Mark
        {
            MarkName = createTaskMarkDto.MarkName,
            HexColor = createTaskMarkDto.HexColor,
            GroupId = createTaskMarkDto.GroupId,
            KanbanId = createTaskMarkDto.KanbanId,
        };

        await _context.Marks.AddAsync(newMark);
        await _context.SaveChangesAsync();

        return Ok(newMark);
    }
    [HttpGet("GetMyBoards")]
    public async Task<IActionResult> GetMyBoards()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if(string.IsNullOrWhiteSpace(userId))
            return Unauthorized();
        
        var groupLists = await _context.GroupUsers
            .Where(x => x.UserId == userId)
            .Select(x => x.GroupId)
            .ToListAsync();
        var kanbanTables = await _context.KanbanTables
            .Where(x => groupLists.Contains(x.GroupId))
            .Select(kanbanTable => new
            {
                kanbanTable.Id,
                kanbanTable.KanbanTableName,
                kanbanTable.GroupId,
                kanbanTable.Group.GroupName,
            })
            .ToListAsync();
        return Ok(kanbanTables);
    }
    
    [HttpDelete("DeleteKanbanTable")]
    public async Task<IActionResult> DeleteKanbanTable([FromBody] DeleteKanbanTableDto deleteKanbanTableDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        bool isUserInGroup =
            await _context.GroupUsers.AnyAsync(x => x.UserId == userId && x.GroupId == deleteKanbanTableDto.GroupId);

        if (!isUserInGroup)
            return BadRequest(new { message = "Something went wront, try again later" });

        var kanbanTableToDelete = await _context.KanbanTables.FirstOrDefaultAsync(x =>
            x.Id == deleteKanbanTableDto.KanbanId && x.GroupId == deleteKanbanTableDto.GroupId);

        if (kanbanTableToDelete == null)
            return BadRequest(new { message = "Table is not exists" });

        _context.KanbanTables.Remove(kanbanTableToDelete);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "delete succesfull",
        });
    }

}