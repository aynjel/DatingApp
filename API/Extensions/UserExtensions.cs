using API.Model.DTO.Response;

namespace API.Extensions;

public static class UserExtensions
{
  public static string Name(this UserDetailsResponseDto user)
  {
    return $"{user.FirstName} {user.LastName}";
  }

  public static UserAccountResponseDto ToDto(this UserDetailsResponseDto user, TokenResponseDto token = null)
  {
    return new UserAccountResponseDto
    {
      UserId = user.UserId,
      Name = user.Name(),
      FirstName = user.FirstName,
      LastName = user.LastName,
      Username = user.Username,
      Email = user.Email,
      Token = token
    };
  }
}
