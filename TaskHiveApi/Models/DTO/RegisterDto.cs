using System.ComponentModel.DataAnnotations;

namespace TaskHiveApi.Models.DTO;

public class RegisterDto
{
    [Required]
    public string? UserName { get; set; }
    [Required]
    [EmailAddress]
    public string? Email { get; set; }
    [Required]
    [MinLength(10)]
    [MaxLength(20)]
    public string? Password { get; set; }
}