using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO.Kanban;
using TaskHiveApi.Models.DTO.KanbanBoard;
using TaskHiveApi.Models.Kanban;

namespace TaskHiveApi.Services;

public class KanbanBoardService : IKanbanBoardService
{
    private readonly ApplicationDbContext _context;

    public KanbanBoardService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<KanbanBoardDto>> GetBoardsAsync(string groupId)
    {
        var kanbanBoards = await _context.KanbanBoards
            .Where(b => b.GroupId == groupId)
            .Select(x => new KanbanBoardDto
            {
                Id = x.Id,
                KanbanBoardName = x.KanbanBoardName,
                GroupId = x.GroupId,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
        return kanbanBoards;
    }

    public Task<KanbanBoard> GetBoardAsync(string kanbanBoardId)
    {
        var kanbanBoard = _context.KanbanBoards
            .Where(b => b.Id == kanbanBoardId)
            .Select(b => new KanbanBoard
            {
                Id = b.Id,
                KanbanBoardName = b.KanbanBoardName,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                GroupId = b.GroupId,
                Columns = b.Columns
                    .OrderBy(x => x.Position)
                    .Select(kc => new KanbanColumn
                    {
                        Id = kc.Id,
                        ColumnName = kc.ColumnName,
                        Position = kc.Position,
                        Cards = kc.Cards
                            .OrderBy(c => c.Position)
                            .Select(kt => new KanbanTask
                            {
                                Id = kt.Id,
                                Title = kt.Title,
                                Description = kt.Description,
                                Position = kt.Position,
                                DueDate = kt.DueDate,
                                Priority = kt.Priority,
                                AssignedUser = kt.AssignedUser != null
                                    ? new User
                                    {
                                        Id = kt.AssignedUser.Id,
                                        UserName = kt.AssignedUser.UserName,
                                    }
                                    : null,
                                Marks = kt.Marks.Select(m => new Mark
                                {
                                    Id = m.Id,
                                    MarkName = m.MarkName,
                                    HexColor = m.HexColor
                                }).ToList()
                            }).ToList(),
                    }).ToList(),
            }).FirstOrDefaultAsync();
        if (kanbanBoard == null)
            return null;
        return kanbanBoard;
    }

    public async Task<KanbanBoardDto> CreateBoardAsync(string groupId, CreateKanbanTableDto dto)
    {
        var newKanbanBoard = new KanbanBoard
        {
            KanbanBoardName = dto.KanbanTableName,
            GroupId = groupId,
            Columns = new List<KanbanColumn>
            {
                new KanbanColumn { ColumnName = "To Do", Position = 0 },
                new KanbanColumn { ColumnName = "Doing", Position = 1 },
                new KanbanColumn { ColumnName = "Done", Position = 2 },
            },
            CreatedAt = DateTime.UtcNow,
        };
        await _context.KanbanBoards.AddAsync(newKanbanBoard);
        await _context.SaveChangesAsync();
        return new KanbanBoardDto
        {
            Id = newKanbanBoard.Id,
            KanbanBoardName = newKanbanBoard.KanbanBoardName,
            GroupId = newKanbanBoard.GroupId,
            CreatedAt = newKanbanBoard.CreatedAt,
            UpdatedAt = newKanbanBoard.UpdatedAt,
        };
    }

    public Task<KanbanBoardDto> UpdateBoardNameAsync(string kanbanBoardId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> DeleteBoardAsync(string userId, DeleteKanbanTableDto dto)
    {
        var kanbanToDelete = await _context.KanbanBoards
            .FirstOrDefaultAsync(x => x.Id == dto.KanbanId &&
                                      x.GroupId == dto.GroupId &&
                                      _context.GroupUsers.Any(gu => gu.UserId == userId && gu.GroupId == dto.GroupId ));
        if (kanbanToDelete == null)
            return false;
        _context.KanbanBoards.Remove(kanbanToDelete);
        await _context.SaveChangesAsync();
        return true;
    }
}