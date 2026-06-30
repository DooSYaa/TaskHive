using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Controllers
{
    [Route("api/marks")]
    [Authorize]
    [ApiController]
    public class MarksController : ControllerBase
    {
           private readonly ApplicationDbContext _context;

           public MarksController(ApplicationDbContext context)
           {
               _context = context;
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
               var isKanbanExist = await _context.KanbanBoards.AnyAsync(x =>
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
           [HttpPatch("UpdateTaskMarks")]
           public async Task<IActionResult> UpdateTaskMarks([FromBody] ToggleMarkDto toggleMarkDto)
           {
               var existKanban =
                   await _context.KanbanBoards.AnyAsync(x =>
                       x.Id == toggleMarkDto.KanbanId && 
                       x.GroupId == toggleMarkDto.GroupId);
               if (!existKanban)
                   return NotFound("Kanban not found");
               var existCard = await _context.KanbanTasks
                   .Include(x => x.Marks)
                   .FirstOrDefaultAsync(x => x.KanbanBoardId == toggleMarkDto.KanbanId &&
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
                   await _context.KanbanBoards.AnyAsync(x =>
                       x.Id == toggleMarkDto.KanbanId && 
                       x.GroupId == toggleMarkDto.GroupId);
               if (!existKanban)
                   return NotFound("Kanban not found");
               var existCard = await _context.KanbanTasks
                   .Include(x => x.Marks)
                   .FirstOrDefaultAsync(x => x.KanbanBoardId == toggleMarkDto.KanbanId &&
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
           
    }
}
