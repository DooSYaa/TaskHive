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

        public async Task Enter(string cardId, string userName)
        {
            Console.WriteLine($"--------------ConnectionId: {Context.ConnectionId}------------------------");
            Console.WriteLine($"--------------UserId: {userName}------------------------");
            await Groups.AddToGroupAsync(Context.ConnectionId, cardId);
        }

        public async Task SendComment(string cardId,  string userName, string message)
        {
            Console.WriteLine($"--------------------CARDID: {cardId}----------------------");
            try
            {
                if (string.IsNullOrEmpty(userName))
                    Console.WriteLine("To pizdec user is null");
                Console.WriteLine("===========================Startnig Sending comment==========================");   

                await Clients.Group(cardId).SendAsync("ReceiveComment", userName, message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"$ERROR sending comment: {ex.Message}\n{ex.StackTrace}");
                throw;
            }
        }
    }
}