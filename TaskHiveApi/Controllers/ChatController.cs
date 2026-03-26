using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;

namespace TaskHiveApi.Controllers;

[Authorize]
[Route("api/[controller]")]
public class ChatController : Controller
{
    private readonly ApplicationDbContext _context;

    public ChatController(ApplicationDbContext context)
    {
        _context = context; 
    }
    [HttpGet("get-messages")]
    public async Task<IActionResult> GetMessages(
        [FromQuery] int offset = 0, [FromQuery] int limit = 20, [FromQuery] string taskId = "")
    {
        if (string.IsNullOrEmpty(taskId))
            return BadRequest();
        var comments = await _context.Comments
            .Include(u => u.User)
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(x => new
            {
                Id = x.Id,
                TaskId = x.TaskId,
                SenderId = x.UserId,
                SenderName = x.User.UserName,
                SenderAvatar = x.User.AvatarUrl,
                Message = x.Message,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync();
        return Ok(comments);
    }

    [HttpGet("get-private-chat-messages")]
    public async Task<IActionResult> GetPrivateChatMessages(
        [FromQuery] string friendId,
        [FromQuery] int offset = 0,
        [FromQuery] int limit = 20)
    {
        if (string.IsNullOrEmpty(friendId))
            return NotFound();
        bool isFriendExists = await _context.Friends.AnyAsync(f => f.FriendId == friendId);
        if (!isFriendExists)
            return NotFound();
        var userName = User.Identity?.Name;
        if (string.IsNullOrEmpty(userName))
            return BadRequest();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user == null)
            return BadRequest();
        var messages = await _context.PrivateMessages
            .Where(x => 
                (x.SenderId == user.Id && x.ReceiverId == friendId) ||
                (x.SenderId == friendId && x.ReceiverId == user.Id))
            .OrderByDescending(x => x.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(x => new
            {
                x.Id,
                x.SenderId,
                SenderName = x.Sender.UserName,
                SenderAvatar = x.Sender.AvatarUrl,
                x.ReceiverId,
                x.Receiver.UserName,
                x.Receiver.AvatarUrl,
                x.Message,
                x.CreatedAt,
            })
            .ToListAsync();
        return Ok(messages);
    }

    [HttpGet("get-group-messages")]
    public async Task<IActionResult> GetGroupMessages(
        [FromQuery] string groupId,
        [FromQuery] int offset = 0,
        [FromQuery] int limit = 20)
    {
        if (string.IsNullOrEmpty(groupId))
            return BadRequest();
        bool isGroupExist = await _context.Groups.AnyAsync(g => g.Id == groupId);
        if (!isGroupExist)
            return NotFound();
        
        var messages = await _context.GroupMessages
            .Where(x => x.GroupId == groupId)
            .OrderByDescending(x => x.CreatedAt)
            .Skip(offset)
            .Take(limit)
            .Select(x => new
            {
                Id = x.Id,
                SenderId = x.Sender.Id,
                SenderName = x.Sender.UserName,
                SenderAvatar = x.Sender.AvatarUrl,
                Message = x.Message,
                CreatedAt = x.CreatedAt,
            })
            .ToListAsync();
        
        return Ok(messages);
    }
}