namespace TaskHiveApi.Models.DTO;

public class LoginResult
{
    public bool Succeeded { get; set; }
    public bool IsLockedOut { get; set; }
    public LoginUserDto? User { get; set; }
}