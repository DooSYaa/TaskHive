using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;
using TaskHiveApi.Models.DTO.Group;

namespace TaskHiveApi.Interfaces;

public interface IGroupsService
{
    public Task<List<GroupDto>> GetGroupsAsync(string? userId); 
    public Task<NewGroupDto> CreateGroupAsync(string userId, CreateGroupDto createGroupDto);
    public Task<AddUserToGroupDto> AddUserToGroupAsync(string userId, AddUserToGroupDto dto);
    public Task<List<User>> GetGroupUserAsync(string userId, string groupId);
}