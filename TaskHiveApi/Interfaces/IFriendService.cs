using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskHiveApi.Models.DTO.Friend;

namespace TaskHiveApi.Interfaces
{
    public interface IFriendService
    {
        public Task<List<FriendDto>> GetFriendsListAsync(string userId);
        public Task<FriendDto> GetFriendAsync(string userId, string friendId);
        public Task<bool> SendFriendRequestAsync(string userId, string friendUserName);
        public Task<List<FriendsRequestsDto>> GetFriendRequestsAsync(string userId);
    }
}