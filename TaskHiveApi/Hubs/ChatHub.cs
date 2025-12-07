using System.Text.RegularExpressions;
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
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ChatService chatService, ApplicationDbContext context, ILogger<ChatHub> logger)
        {
            _chatService = chatService;
            _context = context;
            _logger = logger;
        }
        public async Task SendMessage(string message, string userName)
        {
            await Clients.All.SendAsync("ReceiveMessage", message, userName);
        }

        public async Task SendPrivateMessage(string from, string to, string message)
        {
            var userId = Context?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var friendId = _context.Users.Where(f => f.UserName == to).Select(f => f.Id).FirstOrDefault();
            if (string.IsNullOrEmpty(userId))
                throw new NullReferenceException("User is null");
            if (friendId == null)
                throw new ArgumentNullException("friendId is null");

            var users = new[] { to, from };
            await Clients.Users(userId, friendId).SendAsync("ReceivePrivateMessage", message, from);
        }

        public async Task Enter(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            Console.WriteLine($"------------The userId ${userId} is connected!---------------------------");
        }

        public async Task SendComment(string cardId, string message)
        {
            Console.WriteLine($"--------------------CARDID: {cardId}----------------------");
            try
            {
                
            Console.WriteLine("===========================Startnig Sending comment==========================");   
            var user = Context?.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(user))
                Console.WriteLine("============================UserNULL========================");

            await Clients.Group(cardId).SendAsync("ReceiveComment", user, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"$ERROR sending comment: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }
    }
}