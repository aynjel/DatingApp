using API.Model.DTO.Response;

namespace API.Extensions;

public static class UserExtensions
{
  public static string Name(this UserDetailsResponseDto user)
  {
    return user.DisplayName.Split(' ').FirstOrDefault() ?? string.Empty;
  }

  public static UserAccountResponseDto ToDto(this UserDetailsResponseDto user, TokenResponseDto token = null)
  {
    return new UserAccountResponseDto
    {
      UserId = user.UserId,
      Name = user.Name(),
      DisplayName = user.DisplayName,
      Email = user.Email,
      Token = token
    };
  }
}
