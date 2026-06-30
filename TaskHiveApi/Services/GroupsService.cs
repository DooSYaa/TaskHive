using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO;
using TaskHiveApi.Models.DTO.Group;
using TaskHiveApi.Models.DTO.GroupUser;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Service;

public class GroupsService : IGroupsService
{
    private readonly ApplicationDbContext _context;

    public GroupsService(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<List<GroupDto>> GetGroupsAsync(string? userId)
    {
        var groups = await _context.Groups
            .AsNoTracking()
            .Where(gu => gu.GroupUsers.Any(u => u.UserId == userId))
            .Include(gu => gu.GroupUsers)
            .ThenInclude(gu => gu.User)
            .Select(g => new GroupDto
            {
                Id = g.Id,
                GroupName = g.GroupName,
                Users = g.GroupUsers.Select(g => new GroupUserDto
                    {
                        Id = g.UserId,
                        UserName = g.User.UserName,
                        Role = g.Role
                    }).ToList(),
                CreatedAt = g.CreatedAt,
            })
            .ToListAsync();

        if (groups == null)
            return null;

        return groups;

    }

    public async Task<NewGroupDto> CreateGroupAsync(string userId, CreateGroupDto createGroupDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            return null;
        var isUserInGroup = await _context.GroupUsers
            .AnyAsync(x => x.UserId == userId && 
                           x.Group.GroupName == createGroupDto.GroupName);
        if (!isUserInGroup)
            return null;
        var group = new Group
        {
            GroupName = createGroupDto.GroupName,
            GroupUsers = 
            [
                new GroupUser
                {
                    UserId = user.Id,
                    Role = GroupRole.Admin,
                }
            ],
        };
        
        await _context.Groups.AddAsync(group);
        await _context.SaveChangesAsync();
        
        var newGroup = new NewGroupDto
        {
            Id = group.Id,
            GroupName = group.GroupName,
            CreatedAt = group.CreatedAt,
        };
        return newGroup;
    }

    public async Task<AddUserToGroupDto> AddUserToGroupAsync(string userId, AddUserToGroupDto dto)
    {
        var friendId = await _context.Users
            .Where(u => u.UserName == dto.friendName)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();
        
        if (friendId == null)
            return null;
        
        var isFriend = await _context.Friends
            .AnyAsync(x => x.UserId == userId && 
                           x.FriendId == friendId);
        if (!isFriend)
            return null;
        var group = await _context.Groups
            .FirstOrDefaultAsync(gu => gu.GroupUsers
                .Any(x => x.UserId == userId &&
                          x.GroupId == dto.groupId));
        if (group == null)
            return null;
        
        var isUserInGroup = await _context.GroupUsers
            .AnyAsync(x => x.UserId == friendId &&
                           x.GroupId == dto.groupId);
        if (isUserInGroup)
            return null;

        group.GroupUsers.Add(new GroupUser
        {
            UserId = friendId,
            GroupId = group.Id,
            Role = GroupRole.User,
        });
        await _context.SaveChangesAsync();
        return new AddUserToGroupDto
        {
            friendName = friendId,
            groupId = group.Id,
        };
    }
}