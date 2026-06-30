using TaskHiveApi.Data;
using TaskHiveApi.Models.Chat;

namespace TaskHiveApi.Service
{
    public class CommentService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CommentService> _logger;
        public CommentService(ApplicationDbContext context,  ILogger<CommentService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task AddCommentAsync(string taskId, string userId, string message)
        {
            var comment = new Comment
            {
                TaskId = taskId,
                UserId = userId,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Comment added");
        }
    }
}