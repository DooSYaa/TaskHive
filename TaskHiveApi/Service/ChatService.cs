using TaskHiveApi.Data;
using TaskHiveApi.Models;

namespace TaskHiveApi.Service;

public class ChatService
{
    private readonly ApplicationDbContext _context;

    public ChatService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SaveMessageAsync(string senderId, string senderUserName, string message)
    {
        var chatMessage = new ChatMessage
        {
            Id = Guid.NewGuid().ToString(),
            SenderId = senderId,
            SenderUserName = senderUserName,
            Message = message,
            Timestamp = DateTime.UtcNow
        };
        _context.ChatMessages.Add(chatMessage);
        await _context.SaveChangesAsync();
    }
}