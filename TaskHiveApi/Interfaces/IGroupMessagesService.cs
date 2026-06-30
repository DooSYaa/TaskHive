using TaskHiveApi.Models.DTO.GroupMessage;

namespace TaskHiveApi.Interfaces;

public interface IGroupMessagesService
{
    public Task<List<GroupMessageDto>> GetGroupMessages(string groupId, int offset, int limit);
}