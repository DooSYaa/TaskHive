using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.Chat;
using TaskHiveApi.Models.DTO.PrivateMessage;

namespace TaskHiveApi.Service;

public class DirectMessagesService : IDirectMessagesSevice
{
    private readonly ApplicationDbContext _context;
    private IDirectMessagesSevice _directMessagesSeviceImplementation;

    public DirectMessagesService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PrivateMessageDto>> GetPrivateChatMessagesAsync(string userId, string friendId, int offset, int limit)
    {
        var isFriendExists = _context.Friends.Any(f => f.FriendId == friendId);
        if (!isFriendExists)
            return null;
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return null;
        var messages = await _context.DirectMessages
            .Where(x =>
                (x.SenderId == userId && x.ReceiverId == friendId) ||
                (x.SenderId == friendId && x.ReceiverId == userId))
            .OrderByDescending(x => x.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(x => new PrivateMessageDto //Must be DTO for private messages
            {
                Id = x.Id,
                SenderId = x.SenderId,
                SenderName = x.Sender.UserName,
                SenderAvatar = x.Sender.AvatarUrl,
                ReceiverId = x.ReceiverId,
                ReceiverName = x.Receiver.UserName,
                ReceiverAvatar = x.Receiver.AvatarUrl,
                Message = x.Message,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync();
        return messages; //сделать чтобы возвращались сообщения
    }

    public async Task SaveMessageAsync(string senderId, string receiverId, string message)
    {
        var privateMessage = new DirectMessage
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Message = message,
            CreatedAt = DateTime.UtcNow
        };

        _context.DirectMessages.Add(privateMessage);
        await _context.SaveChangesAsync();
    }
}