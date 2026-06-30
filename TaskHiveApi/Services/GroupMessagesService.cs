using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models.DTO.GroupMessage;

namespace TaskHiveApi.Service;

public class GroupMessagesService : IGroupMessagesService
{
    private readonly ApplicationDbContext _context;

    public GroupMessagesService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<GroupMessageDto>> GetGroupMessages(string groupId, int offset, int limit)
    {
        bool isGroupExist = await _context.Groups.AnyAsync(g => g.Id == groupId);
        if (!isGroupExist)
            return null;

        var messages = await _context.GroupMessages
            .Where(gm => gm.GroupId == groupId)
            .OrderByDescending(gm => gm.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(gm => new GroupMessageDto
            {
                Id = gm.Id,
                SenderId = gm.SenderId,
                SenderName = gm.Sender.UserName,
                SenderAvatar = gm.Sender.AvatarUrl,
                Message = gm.Message,
                CreatedAt = gm.CreatedAt,
            })
            .ToListAsync();

        return messages;
    }
}