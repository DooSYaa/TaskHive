using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TaskHiveApi.Interfaces;
using TaskHiveApi.Models;
using JwtRegisteredClaimNames = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames;

namespace TaskHiveApi.Service;

public class TokenService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly SymmetricSecurityKey _key;
    
    public TokenService(IConfiguration config)
    {
        _configuration = config;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    }

    public string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName),
        };
        var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddHours(2),
            SigningCredentials = creds,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }
    // public string GenerateJwtToken(User user)
    // {
    //     var claims = new List<Claim>
    //     {
    //         new Claim(ClaimTypes.NameIdentifier, user.Id),
    //         new Claim(ClaimTypes.Name, user.UserName),
    //         new Claim(ClaimTypes.Email, user.Email),
    //     };
    //     var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256);
    //     var token = new JwtSecurityToken
    //     (
    //         issuer: _configuration["Jwt:Issuer"],
    //         audience: _configuration["Jwt:Audience"],
    //         claims: claims,
    //         expires: DateTime.UtcNow.AddHours(1),
    //         signingCredentials: creds
    //     );
    //     var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
    //     return tokenString;
    // }
}