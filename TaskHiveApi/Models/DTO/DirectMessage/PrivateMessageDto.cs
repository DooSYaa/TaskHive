namespace TaskHiveApi.Models.DTO.PrivateMessage;

public class PrivateMessageDto
{
    public string? Id { get; set; }
    public string? SenderId { get; set; }
    public string? SenderName { get; set; }
    public string? SenderAvatar { get; set; }
    public string? ReceiverId { get; set; }
    public string? ReceiverName { get; set; }
    public string? ReceiverAvatar { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; }
}