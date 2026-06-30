using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.Comment;

namespace TaskHiveApi.Service;

public class CommentsService : ICommentsService
{
    private readonly ApplicationDbContext _context;

    public CommentsService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<CommentDto>> GetComments(string taskId, int offset, int limit)
    {
        var isTaskExists = _context.KanbanTasks
            .Any(card => card.Id == taskId);
        if  (!isTaskExists)
            return null;

        var comments = await _context.Comments
            .Include(u => u.User)
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                TaskId = c.TaskId,
                SenderId = c.UserId,
                SenderName = c.User.UserName,
                SenderAvatar = c.User.AvatarUrl,
                Message = c.Message,
                CreatedAt = c.CreatedAt,
            })
            .ToListAsync();

        return comments;
    }
}