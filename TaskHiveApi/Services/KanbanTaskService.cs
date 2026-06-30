using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Services;

public class KanbanTaskService : IKanbanTaskService
{
    private readonly ApplicationDbContext _context;
    private IKanbanTaskService _kanbanTaskServiceImplementation;

    public KanbanTaskService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<NewKanbanTaskDto> CreateKanbanTaskAsync(string kanbanBoardId, string kanbanColumnId, CreateKanbanCardDto dto)
    {
        var lastTaskPosition = await _context.KanbanTasks
            .Where(x => x.KanbanBoardId == kanbanBoardId &&
                        x.KanbanColumnId == kanbanColumnId)
            .Select(x => (int?)x.Position)
            .MaxAsync() ?? -1;
        var newKanbanTask = new KanbanTask
        {
            KanbanBoardId = kanbanBoardId,
            KanbanColumnId = kanbanColumnId,
            Title = dto.Title,
            Position = lastTaskPosition + 1,
        };
        await _context.KanbanTasks.AddAsync(newKanbanTask);
        await _context.SaveChangesAsync();
        return new NewKanbanTaskDto
        {
            Id = newKanbanTask.Id,
            KanbanBoardId = newKanbanTask.KanbanBoardId,
            KanbanColumnId = newKanbanTask.KanbanColumnId,
            Title = newKanbanTask.Title,
            CreatedAt = newKanbanTask.CreatedAt,
        };
    }
    public async Task<string> ChangeKanbanTaskNameAsync(string kanbanTaskId, string kanbanTaskName)
    {
        var currentKanbanTaskName = await _context.KanbanTasks
            .Where(x => x.Id == kanbanTaskId)
            .Select(x => x.Title)
            .FirstOrDefaultAsync();
        if  (currentKanbanTaskName == null)
            return null;
        currentKanbanTaskName = kanbanTaskName;
        await _context.SaveChangesAsync();
        return currentKanbanTaskName;
    }
    public async Task<bool> DeleteKanbanTaskAsync(string kanbanTaskId)
    {
        var kanbanTaskToDelete = await _context.KanbanTasks
            .FirstOrDefaultAsync(x => x.Id == kanbanTaskId);
        if  (kanbanTaskToDelete == null)
            return false;
        _context.KanbanTasks.Remove(kanbanTaskToDelete);
        await _context.SaveChangesAsync();
        return true;
    }
}