using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class CreateUserRequestDto
{
  [Required(ErrorMessage = "Display name is required")]
  public string DisplayName { get; set; } = string.Empty;

  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid email address format")]
  public string Email { get; set; } = string.Empty;

  [Required(ErrorMessage = "Password is required")]
  [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
  public string Password { get; set; } = string.Empty;
}
