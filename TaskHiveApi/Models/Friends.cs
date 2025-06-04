using System.ComponentModel.DataAnnotations.Schema;
using TaskHiveApi.Models.Enums;

namespace TaskHiveApi.Models;

public class Friends
{
    public string Id { get; set; }
    public string UserId { get; set; } // ID пользователя, который добавил в друзья
    public string FriendId { get; set; } // ID друга

    [ForeignKey(nameof(UserId))]
    public User User { get; set; }

    [ForeignKey(nameof(FriendId))]
    public User Friend { get; set; }
    
    public Status Status { get; set; }
}