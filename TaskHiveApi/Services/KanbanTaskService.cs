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
    public async Task ChangeColumnAsync(string kanbanTaskId, MoveKanbanCardDto dto)
    {
        var sourceColumn = await _context.KanbanColumns
            .FirstOrDefaultAsync(x => x.Id == dto.SourceKanbanColumnId);
        if (sourceColumn == null)
            return;
        var targetColumn = await _context.KanbanColumns
            .FirstOrDefaultAsync(x => x.Id == dto.TargetKanbanColumnId);
        if (targetColumn == null)
            return;
        var targetCard = sourceColumn.Cards.FirstOrDefault(x => x.Id == kanbanTaskId);
        if (targetCard == null)
            return;
        sourceColumn.Cards.Remove(targetCard);
        targetCard.KanbanColumnId = dto.TargetKanbanColumnId;
        var targetCards = targetColumn
            .Cards.OrderBy(c => c.Position).ToList();
        var targetIndex = Math.Clamp(dto.Position - 1, 0, targetCards.Count);
        targetCards.Insert(targetIndex, targetCard);
        
        for (int i = 0; i < targetCards.Count; i++)
            targetCards[i].Position = i;
        for (int i = 0; i < targetColumn.Cards.Count; i++)
            sourceColumn.Cards[i].Position = i;
        
        await _context.SaveChangesAsync();
    }
    public async Task UpdateTaskPositionAsync(string kanbanTaskId, string kanbanColumnId, int position)
    {
        var targetColumn = await _context.KanbanColumns
            .Include(c => c.Cards)
            .FirstOrDefaultAsync(x => x.Id == kanbanColumnId);
        if (targetColumn == null)
            return;
        var targetCard = targetColumn.Cards.FirstOrDefault(x => x.Id == kanbanTaskId);
        if (targetCard == null)
            return;
        var cards = targetColumn.Cards.OrderBy(c => c.Position).ToList();
        cards.Remove(targetCard);
        var insertIndex = Math.Clamp(position, 0, cards.Count);
        cards.Insert(insertIndex, targetCard);

        for(int i = 0; i < cards.Count; i++)
            cards[i].Position = i;

        await _context.SaveChangesAsync();
    }
}