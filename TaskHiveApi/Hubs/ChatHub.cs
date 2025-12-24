using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Models;
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
            var userId = Context.UserIdentifier;
            var friendId = _context.Users.Where(f => f.UserName == to).Select(f => f.Id).FirstOrDefault();
            if (string.IsNullOrEmpty(userId))
                throw new NullReferenceException("User is null");
            if (friendId == null)
                throw new ArgumentNullException("friendId is null");

            var users = new[] { to, from };
            await Clients.Users(userId, friendId).SendAsync("ReceivePrivateMessage", message, from);
        }

        public async Task SendGroupMessage(string groupId, string messageContetnt)
        {
            System.Console.WriteLine($"===================GROUP ID: {groupId}==========================");
            if(string.IsNullOrWhiteSpace(messageContetnt)) return;

            var senderId = Context.UserIdentifier;
            var userName = Context.User.Identity.Name;
            Console.WriteLine($"Отправка в группу {groupId}: {messageContetnt}");
            await Clients.Group(groupId).SendAsync("ReceiveGroupMessage", new
            {
                Id = Guid.NewGuid().ToString(),
                SenderId = senderId, 
                SenderName = userName,
                Message = messageContetnt,
                CreatedAt = DateTime.UtcNow,
            });
            System.Console.WriteLine("==================Message received!=================");
            System.Console.WriteLine(messageContetnt);
        }

        public async Task JoinGroup(string groupId)
        {
            Console.WriteLine($"Пользователь {Context.ConnectionId} подключается к группе: {groupId}");
            var userId = Context.UserIdentifier;
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        public async Task LeaveGroup(string groupId)
        {
            var userId = Context.UserIdentifier;
            await Groups.RemoveFromGroupAsync(userId, groupId);
        }

        public async Task SendComment(string cardId,  string userName, string message)
        {
            try
            {
                if (string.IsNullOrEmpty(userName))
                    Console.WriteLine("user is null");

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