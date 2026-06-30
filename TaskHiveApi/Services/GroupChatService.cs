using TaskHiveApi.Models.Chat;
using TaskHiveApi.Data;

namespace TaskHiveApi.Service
{
    public class GroupChatService
    {
        private readonly ApplicationDbContext _context;
        public GroupChatService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveMessageAsync(string groupId, string senderId, string message)
        {
            var groupMessage = new GroupMessage
            {
                GroupId = groupId,
                SenderId = senderId,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };

            _context.GroupMessages.Add(groupMessage);
            await _context.SaveChangesAsync();
        }
    }
}