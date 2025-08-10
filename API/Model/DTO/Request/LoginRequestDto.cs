using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class LoginRequestDto
{
  [Required(ErrorMessage = "Username is required")]
  [StringLength(50, ErrorMessage = "Username must be between 3 and 50 characters", MinimumLength = 3)]
  public string Username { get; set; } = string.Empty;

  [Required(ErrorMessage = "Password is required")]
  [StringLength(100, ErrorMessage = "Password must be between 6 and 100 characters", MinimumLength = 6)]
  public string Password { get; set; } = string.Empty;
}
