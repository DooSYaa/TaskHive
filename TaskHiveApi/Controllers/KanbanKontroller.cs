using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    [HttpPost("CreateKanbanTable")]
    public IActionResult CreateKanbanTable([FromBody]CreateKanbanTableDto KanbanTableDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var KanbanTable = new KanbanTable
        {
            KanbanTableName = KanbanTableDto.KanbanTableName,
            GroupId = KanbanTableDto.GroupId,
        };
        _context.KanbanTables.Add(KanbanTable);
        _context.SaveChanges();
        
        return Ok(new
        {
            id = KanbanTableDto.GroupId,
            name = KanbanTableDto.KanbanTableName,
        });
    }

}