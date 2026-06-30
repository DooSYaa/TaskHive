namespace TaskHiveApi.Models.DTO.GroupMessage;

public class GroupMessageDto
{
    public Guid Id { get; set; }
    public string? SenderId { get; set; }
    public string? SenderName { get; set; }
    public string? SenderAvatar { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; }
}