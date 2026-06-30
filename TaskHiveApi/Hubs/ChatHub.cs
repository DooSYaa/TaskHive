using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Service;

namespace TaskHiveApi.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly DirectMessagesService _directMessagesService;
        private readonly GroupChatService _groupChatService;
        private readonly CommentService _commentService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(DirectMessagesService directMessagesService, GroupChatService groupChatService, CommentService commentService, ApplicationDbContext context, ILogger<ChatHub> logger)
        {
            _directMessagesService = directMessagesService;
            _groupChatService = groupChatService;
            _commentService = commentService;
            _context = context;
            _logger = logger;
        }
        public async Task SendMessage(string message, string userName)
        {
            await Clients.All.SendAsync("ReceiveMessage", message, userName);
        }

        public async Task SendPrivateMessage(string receiverId, string message)
        {
            if(string.IsNullOrEmpty(receiverId))
                throw new NullReferenceException("receiverId");
            
            var senderId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderId))
                throw new NullReferenceException("User is null");
            await _directMessagesService.SaveMessageAsync(senderId, receiverId, message);
            var sender = await _context.Users
                .Where(x => x.Id == senderId)
                .Select(x => new
                {
                    x.Id,
                    x.UserName,
                    x.AvatarUrl,                
                })
                .FirstOrDefaultAsync(); 
            if (sender == null)
                throw new NullReferenceException("User not found");
            var receiver = await _context.Users
                .Where(f => f.Id == receiverId)
                .Select(f => new
                {
                    f.Id,
                    f.UserName,
                    f.AvatarUrl,
                })
                .FirstOrDefaultAsync();
            if (receiver == null)
                throw new NullReferenceException("friendId is null");

            var messageDto = new
            {
                Id = Guid.NewGuid().ToString(),
                SenderId = sender.Id,
                SenderName = sender.UserName,
                SenderAvatar = sender.AvatarUrl,
                ReceiverId = receiver.Id,
                ReceiverName = receiver.UserName,
                ReceiverAvatar = receiver.AvatarUrl,
                Message = message,
                CreatedAt = DateTime.UtcNow
            };
            await Clients
                .Users(senderId, receiverId)
                .SendAsync("ReceivePrivateMessage",  messageDto);
        }

        public async Task SendGroupMessage(string groupId, string messageContent)
        {
            if(string.IsNullOrWhiteSpace(messageContent) || string.IsNullOrEmpty(groupId)) return;
            var senderId = Context.UserIdentifier;
            if (string.IsNullOrEmpty(senderId))
                throw new NullReferenceException("senderId");
            await _groupChatService.SaveMessageAsync(groupId, senderId, messageContent);
            var sender = await _context.Users
                .Where(x => x.Id == senderId)
                .Select(x => new
                {
                    x.Id,
                    x.UserName,
                    x.AvatarUrl,
                })
                .FirstOrDefaultAsync();
            if (sender == null)
                throw new NullReferenceException("User not found");
            var messageDto = new
            {
                Id = Guid.NewGuid().ToString(),
                SenderId = sender.Id,
                SenderName = sender.UserName,
                SenderAvatar = sender.AvatarUrl,
                Message = messageContent,
                CreatedAt = DateTime.UtcNow
            };
            await Clients
                .Group(groupId)
                .SendAsync("ReceiveGroupMessage", messageDto);
        }

        public async Task JoinGroup(string groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        public async Task LeaveGroup(string groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
        }

        public async Task SendComment(string cardId, string message)
        {
            try
            {
                var userId = Context.UserIdentifier;
                if (string.IsNullOrEmpty(userId))
                    throw new NullReferenceException("User is null");
                await _commentService.AddCommentAsync(cardId, userId, message);
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                var commentDto = new
                {
                    CardId = cardId,
                    SenderId = user.Id,
                    SenderName = user.UserName,
                    SenderAvatar = user.AvatarUrl,
                    Message = message,
                    CreatedAt = DateTime.UtcNow,
                };
                await Clients.Group(cardId).SendAsync("ReceiveComment", cardId, commentDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"$ERROR sending comment: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }
    }
}