using System.ComponentModel.DataAnnotations;

namespace API.Model.DTO.Request;

public class CreateUserRequestDto
{
  [Required(ErrorMessage = "First name is required")]
  public string FirstName { get; set; } = string.Empty;

  [Required(ErrorMessage = "Last name is required")]
  public string LastName { get; set; } = string.Empty;

  [Required(ErrorMessage = "Username is required")]
  [StringLength(20, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 20 characters")]
  public string Username { get; set; } = string.Empty;

  [Required(ErrorMessage = "Email is required")]
  [EmailAddress(ErrorMessage = "Invalid email address format")]
  public string Email { get; set; } = string.Empty;

  [Required(ErrorMessage = "Password is required")]
  [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long")]
  public string Password { get; set; } = string.Empty;
}
