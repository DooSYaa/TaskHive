using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TaskHiveApi.Data;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using TaskHiveApi.Models.DTO.Friend;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Services
{
    public class FriendService : IFriendService
    {
        private readonly ApplicationDbContext _context;
        public FriendService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AcceptFriendRequestAsync(string userId, string friendId, Friend friendRequest)
        {
            friendRequest.Status = Status.Accepted;
                var newRelation = new Friend
                {
                    UserId = userId,
                    FriendId = friendId,
                    Status = Status.Accepted,
                };
                _context.Update(friendRequest);
                await _context.Friends.AddAsync(newRelation);
                await _context.SaveChangesAsync();
                return true;
        }

        public async Task<FriendDto> GetFriendAsync(string userId, string friendId)
        {
            var friend = await _context.Friends
                .Where(f => f.Id == friendId &&
                f.UserId == userId)
                .Select(f => new FriendDto
                {
                    Id = f.Id,
                    Name = f.FriendData.UserName,
                    Email = f.FriendData.Email,
                })
                .FirstOrDefaultAsync();
                if (friend == null)
                    return null;
            return friend;
        }

        public async Task<List<FriendsRequestsDto>> GetFriendRequestsAsync(string userId)
        {
            var friendRequests = await _context.Friends
                .Where(u => u.UserId == userId && 
                u.Status == Status.Pending)
                .Select(r => new FriendsRequestsDto
                {
                    UserName = r.FriendData.UserName,
                })
                .ToListAsync();

            return friendRequests;
        }

        public async Task<List<FriendDto>> GetFriendsListAsync(string userId)
        {
            var friends = await _context.Friends
                .Where(u => u.UserId == userId)
                .Select(x => new FriendDto
                {
                    Id = x.Id,
                    Name = x.FriendData.UserName,
                    Email = x.FriendData.Email,
                })
                .ToListAsync();
            
            if (friends == null)
                return null;

            return friends;
        }

        public async Task<bool> SendFriendRequestAsync(string userId, string friendUserName)
        {
            var targetFriendId = await _context.Users
                .Where(u => u.UserName == friendUserName)
                .Select(i => i.Id)
                .FirstOrDefaultAsync();
            if (string.IsNullOrEmpty(targetFriendId) || string.IsNullOrEmpty(userId))
                return false;
            var friendRequest = await _context.Friends
                .FirstOrDefaultAsync(r => (r.UserId == userId &&
                r.FriendId == targetFriendId && 
                r.Status == Status.Pending) ||
                (r.UserId == targetFriendId && 
                r.FriendId == userId &&
                r.Status == Status.Pending));

            if (friendRequest != null && friendRequest.Status == Status.Pending)
            {
                var isAcceptedFriendRequest = await AcceptFriendRequestAsync(userId, targetFriendId, friendRequest);
                if (isAcceptedFriendRequest)
                return true;
            } 
            else
            {
                var newFriendRequest = new Friend
                {
                    UserId = userId,
                    FriendId = targetFriendId,
                    Status = Status.Pending
                };
                await _context.Friends.AddAsync(newFriendRequest);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}