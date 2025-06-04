using TaskHiveApi.Models;

namespace TaskHiveApi.Interfaces;

public interface IJwtService
{
    string GenerateJwtToken(User user);
}