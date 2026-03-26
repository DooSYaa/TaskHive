using TaskHiveApi.Data;
using TaskHiveApi.Models.Chat;

namespace TaskHiveApi.Service;

public class PrivateChatService
{
    private readonly ApplicationDbContext _context;

    public PrivateChatService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SaveMessageAsync(string senderId, string receiverId, string message)
    {
        var privateMessage = new PrivateMessage
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Message = message,
            CreatedAt = DateTime.UtcNow
        };

        _context.PrivateMessages.Add(privateMessage);
        await _context.SaveChangesAsync();
    }
}