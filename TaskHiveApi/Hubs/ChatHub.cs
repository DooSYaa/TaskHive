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
        private readonly ChatService _chatService;
        private readonly ApplicationDbContext _context;

        public ChatHub(ChatService chatService, ApplicationDbContext context)
        {
            _context = context;
            _chatService = chatService;
        }

        public async Task SendMessage(string sender, string message)
        {
            var userId = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("User not authenticated");
            }
        
            await _chatService.SaveMessageAsync(userId, sender, message);
            await Clients.All.SendAsync("ReceiveMessage", sender, message);
        }
        public async Task SendPrivateMessage(string sender, string receiverUserName, string message)
        {
            var userId = Context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new HubException("User not authenticated");
            }

            var receiver = await _context.Users.FirstOrDefaultAsync(u => u.UserName == receiverUserName);
            if (receiver == null)
            {
                throw new HubException("Receiver not found");
            }

            await Clients.User(receiver.Id).SendAsync("ReceiveMessage", sender, message);
            await _chatService.SaveMessageAsync(userId, sender, message);
        }
    }
}
    
