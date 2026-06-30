using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Services;

public class KanbanColumnService : IKanbanColumnService
{
    private readonly ApplicationDbContext _context;

    public KanbanColumnService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<KanbanColumn>> GetKanbanColumns(string kanbanBoardId)
    {
        var kanbanColumns = await _context.KanbanColumns
            .Where(x => x.KanbanBoardId == kanbanBoardId)
            .ToListAsync();
        return kanbanColumns;
    }

    public async Task<KanbanColumn> CreateKanbanColumnAsync(string kanbanBoardId, CreateKanbanBlockDto dto)
    {
        var lastKanbanColumnPosition = await _context.KanbanColumns
            .Where(x => x.KanbanBoardId == kanbanBoardId)
            .Select(x => (int?)x.Position)
            .MaxAsync() ?? -1;
        var newKanbanColumn = new KanbanColumn
        {
            KanbanBoardId = kanbanBoardId,
            ColumnName = dto.kanbanBlockName,
            Position = lastKanbanColumnPosition + 1,
        };
        await _context.KanbanColumns.AddAsync(newKanbanColumn);
        await _context.SaveChangesAsync();
        return newKanbanColumn;
    }

    public async Task<bool> MoveKanbanColumnAsync(string kanbanColumnId, int position)
    {
        var sourceColumn = await _context.KanbanColumns
            .FirstOrDefaultAsync(x => x.Id == kanbanColumnId);
        if (sourceColumn == null)
            return false;
        var columns = await _context.KanbanColumns
            .Where(x => x.KanbanBoardId == sourceColumn.KanbanBoardId)
            .OrderBy(p => p.Position)
            .ToListAsync();
        columns.Remove(sourceColumn);
        var targetIndex = Math.Clamp(position, 0, columns.Count);
        columns.Insert(targetIndex, sourceColumn);
        for (int i = 0; i < columns.Count; i++)
        {
            columns[i].Position = i;
        }
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteKanbanColumnAsync(string kanbanColumnId)
    {
        var column = await _context.KanbanColumns
            .FirstOrDefaultAsync(x => x.Id == kanbanColumnId);
        var columns = await _context.KanbanColumns
            .Where(b => b.KanbanBoardId == column.KanbanBoardId)
            .OrderBy(p => p.Position)
            .ToListAsync();
        _context.KanbanColumns.Remove(column);
        columns.Remove(column);
        for (int i = 0; i < columns.Count; i++)
        {
            columns[i].Position = i; 
        }
        await _context.SaveChangesAsync();
        return true;
    }
}