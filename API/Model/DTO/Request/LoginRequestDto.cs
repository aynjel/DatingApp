using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class LoginRequestDto
{
  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid email address format")]
  public string Email { get; set; } = string.Empty;

  [Required(ErrorMessage = "Password is required")]
  [StringLength(100, ErrorMessage = "Password must be between 6 and 100 characters", MinimumLength = 6)]
  public string Password { get; set; } = string.Empty;
}
