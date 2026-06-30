using TaskHiveApi.Models.DTO.PrivateMessage;

namespace TaskHiveApi.Interfaces;

public interface IDirectMessagesSevice
{
    Task<List<PrivateMessageDto>> GetPrivateChatMessagesAsync(string userId, string friendId, int offset, int limit);
    Task SaveMessageAsync(string senderId, string receiverId, string message);
}