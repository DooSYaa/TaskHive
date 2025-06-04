namespace TaskHiveApi.Models;

public class ChatMessage
{
        public string Id { get; set; }
        public string SenderId { get; set; }
        public string SenderUserName { get; set; } 
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
}