using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Kanban;

namespace TaskHiveApi.Controllers
{
    [Route("api/kanban-tasks")]
    [Authorize]
    [ApiController]
    public class KanbanTasksController : ControllerBase
    {
        private readonly IKanbanTaskService _kanbanTaskService;

        public KanbanTasksController(IKanbanTaskService kanbanTaskService)
        {
            _kanbanTaskService = kanbanTaskService;
        }

        [HttpPost("{kanbanBoardId}")]
        public async Task<IActionResult> CreateKanbanTaskAsync(
            string kanbanBoardId,
            [FromBody] CreateKanbanCardDto kanbanTaskDto)
        {
            if (string.IsNullOrEmpty(kanbanBoardId))
                return BadRequest();
            if (kanbanTaskDto == null)
                return BadRequest();
            var newKanbanTask =
                await _kanbanTaskService.CreateKanbanTaskAsync(kanbanBoardId, kanbanTaskDto.kanbanColumnId, kanbanTaskDto);
            if (newKanbanTask == null)
                return BadRequest();
            return Ok(newKanbanTask);
        }
        [HttpPut("{kanbanTaskId}")]
        public async Task<IActionResult> UpdateKanbanTaskNameAsync(string kanbanTaskId, [FromBody] string kanbanTaskName)
        {
            if (string.IsNullOrEmpty(kanbanTaskId) || string.IsNullOrEmpty(kanbanTaskName))
                return BadRequest();
            var result = await _kanbanTaskService
                .ChangeKanbanTaskNameAsync(kanbanTaskId, kanbanTaskName);
            if (result == null)
                return BadRequest();
            return Ok(result);
        }
        [HttpDelete("{kanbanTaskId}")]
        public async Task<IActionResult> DeleteKanbanTaskAsync(string kanbanTaskId)
        {
            if (string.IsNullOrEmpty(kanbanTaskId))
                return BadRequest();
            var isKanbanTaskDeleted = await _kanbanTaskService
                .DeleteKanbanTaskAsync(kanbanTaskId);
            if (!isKanbanTaskDeleted)
                return BadRequest();
            return NoContent();
        }
        [HttpPut("{kanbanTaskId}/move")]
        public async Task<IActionResult> Move(string kanbanTaskId, [FromBody] MoveKanbanCardDto moveKanbanCardDto)
        {
            if (!string.IsNullOrEmpty(kanbanTaskId))
                return BadRequest();
            if (moveKanbanCardDto.SourceKanbanColumnId == moveKanbanCardDto.TargetKanbanColumnId)
                await _kanbanTaskService.UpdateTaskPositionAsync(
                    kanbanTaskId, 
                    moveKanbanCardDto.SourceKanbanColumnId, 
                    moveKanbanCardDto.Position);
            
            await _kanbanTaskService.ChangeColumnAsync(
                    kanbanTaskId, 
                    moveKanbanCardDto);
            return Ok( new {message = "Success!"});
        }
    }
}
//         // [HttpPatch("UpdateTaskPriority")]
//         // public async Task<IActionResult> UpdateTaskPriority([FromBody] UpdateTaskPriorityDto updateTaskPriorityDto)
//         // {
//         //     var existKanban = await _context.KanbanBoards
//         //         .AnyAsync(x => x.Id == updateTaskPriorityDto.KanbanId && 
//         //                        x.GroupId == updateTaskPriorityDto.GroupId);
//         //     if (!existKanban)
//         //         return NotFound("Kanban not found or not exist");
//         //     var existCard = await _context.KanbanTasks
//         //         .FirstOrDefaultAsync(x => x.Id == updateTaskPriorityDto.CardId &&
//         //                                 x.KanbanTableId == updateTaskPriorityDto.KanbanId);
//         //     if (existCard == null)
//         //         return NotFound("Card not found");
//         //
//         //     if (existCard.Priority != updateTaskPriorityDto.Priority)
//         //     {
//         //         existCard.Priority = updateTaskPriorityDto.Priority;
//         //         await _context.SaveChangesAsync();
//         //     }
//         //
//         //     return Ok();
//         // }
//         // [HttpPatch("UpdateTaskAssignedUser")]
//         // public async Task<IActionResult> UpdateTaskAssignedUser([FromBody] UpdateAssignedUserDto updateAssignedUserDto)
//         // {
//         //     var existKanban =
//         //         await _context.KanbanBoards.AnyAsync(x =>
//         //             x.Id == updateAssignedUserDto.KanbanId && 
//         //             x.GroupId == updateAssignedUserDto.GroupId);
//         //     if (!existKanban)
//         //         return NotFound("Kanban not found");
//         //     var existCard = await _context.KanbanTasks
//         //         .FirstOrDefaultAsync(x => x.KanbanTableId == updateAssignedUserDto.KanbanId &&
//         //                                   x.Id == updateAssignedUserDto.CardId);
//         //     if (existCard == null)
//         //         return NotFound("Card not found");
//         //     if(updateAssignedUserDto.AssignedUserId != null)
//         //     {
//         //         var userExists = await _context.Users.AnyAsync(x => x.Id == updateAssignedUserDto.AssignedUserId);
//         //         if (!userExists)
//         //             return BadRequest("User not found");
//         //     }
//         //     existCard.AssignedUserId = updateAssignedUserDto.AssignedUserId;
//         //     await _context.SaveChangesAsync();
//         //     return Ok();
//         // }
//         // [HttpPatch("UpdateTaskDate")]
//         // public async Task<IActionResult> UpdateTaskDate([FromBody] UpdateTaskDateDto updateTaskDateDto)
//         // {
//         //     Console.WriteLine($"Received UpdateTaskDateDto: {updateTaskDateDto.DueDateTime}");
//         //     var existKanban =
//         //         await _context.KanbanBoards.AnyAsync(x =>
//         //             x.Id == updateTaskDateDto.KanbanId && 
//         //             x.GroupId == updateTaskDateDto.GroupId);
//         //     if (!existKanban)
//         //         return NotFound("Kanban not found");
//         //     var existCard = await _context.KanbanTasks
//         //         .FirstOrDefaultAsync(x => x.KanbanTableId == updateTaskDateDto.KanbanId &&
//         //                                   x.Id == updateTaskDateDto.CardId);
//         //     if (existCard == null)
//         //         return NotFound("Card not found");
//         //
//         //     existCard.DueDate = updateTaskDateDto.DueDateTime;
//         //     await _context.SaveChangesAsync();
//         //
//         //     return Ok();
//         // }
//
//         // [HttpPatch]
//         // public async Task<IActionResult> UpdateTaskDescription([FromBody] UpdateTaskDescriptionDto updateTaskDescriptionDto)
//         // {
//         //     var existKanban =
//         //         await _context.KanbanBoards.AnyAsync(x =>
//         //             x.Id == updateTaskDescriptionDto.KanbanId && 
//         //             x.GroupId == updateTaskDescriptionDto.GroupId);
//         //     if (!existKanban)
//         //         return NotFound("Kanban not found");
//         //     var existCard = await _context.KanbanTasks
//         //         .FirstOrDefaultAsync(x => x.KanbanTableId == updateTaskDescriptionDto.KanbanId &&
//         //                                   x.Id == updateTaskDescriptionDto.CardId);
//         //     if (existCard == null)
//         //         return NotFound("Card not found");
//         //     if (existCard.Description != updateTaskDescriptionDto.Description)
//         //     {
//         //         existCard.Description = updateTaskDescriptionDto.Description;
//         //         await _context.SaveChangesAsync();
//         //     }
//         //     return Ok();
//         // }
//         [HttpGet("GetMyGroupTasks")]
//         public async Task<IActionResult> GetMyGroupTasks(GetMyGroupTasksDto getMyGroupTasksDto)
//         {
//             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//             if (string.IsNullOrEmpty(userId))
//                 return Unauthorized();
//
//             var tasks = await _context.KanbanBoards
//                 .Where(x => x.GroupId == getMyGroupTasksDto.GroupId)
//                 .SelectMany(x => x.Tasks)
//                 .Select(card => new
//                 {
//                     Id = card.Id,
//                     Title = card.Title,
//                     Description = card.Description,
//                     DueDate = card.DueDate,
//                     Priority = card.Priority,
//                     AssignedUserid = card.AssignedUserId,
//                     TableName = card.KanbanBoard.KanbanBoardName,
//                     ColumnName = card.KanbanColumn.ColumnName,
//                     GroupId = card.KanbanBoard.GroupId,
//                     KanbanId = card.KanbanBoard.Id,
//                     Marks = card.Marks.Select(m => new
//                     {
//                         m.Id,
//                         m.MarkName,
//                         m.HexColor,
//                     }).ToList()
//                 })
//                 .OrderBy(t => t.DueDate)
//                 .ToListAsync();
//
//             return Ok(tasks);
//
//         }
//         [HttpGet("GetMyTasks")]
//         public async Task<IActionResult> GetMyTasks()
//         {
//             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//             if(string.IsNullOrWhiteSpace(userId))
//                 return Unauthorized();
//         
//             var groupLists = await _context.GroupUsers
//                 .Where(x => x.UserId == userId)
//                 .Select(x => x.GroupId)
//                 .ToListAsync();
//             var tasks = await _context.KanbanBoards
//                 .Where(x => groupLists.Contains(x.GroupId))
//                 .SelectMany(x => x.Tasks)
//                 .Where(card => card.AssignedUserId == userId)
//                 .Select(card => new
//                 {
//                     Id = card.Id,
//                     Title = card.Title,
//                     Description = card.Description,
//                     DueDate = card.DueDate,
//                     Priority = card.Priority,
//                     AssignedUserId = card.AssignedUserId,
//                     GroupName = card.KanbanBoard.Group.GroupName,
//                     TableName = card.KanbanBoard.KanbanBoardName,
//                     ColumnName = card.KanbanColumn.ColumnName,
//                     GroupId = card.KanbanBoard.GroupId,
//                     KanbanId = card.KanbanBoard.Id,
//                     Marks = card.Marks.Select(x => new
//                     {
//                         x.Id,
//                         x.MarkName,
//                         x.HexColor,
//                     }).ToList()
//                 })
//                 .OrderBy(t => t.DueDate == null)
//                 .ThenByDescending(t => t.DueDate < DateTime.Now)
//                 .ThenBy(t => t.DueDate)
//                 .ThenByDescending(t => t.Priority)
//                 .ToListAsync();
//             return Ok(tasks);
//
//         } 
//     }
// }
//
//                