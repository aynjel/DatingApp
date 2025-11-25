using API.Model.DTO.Response;

namespace API.Extensions;

public static class UserExtensions
{
  public static UserAccountResponseDto ToDto(this UserDetailsResponseDto user, TokenResponseDto token = null)
  {
    return new UserAccountResponseDto
    {
      DisplayName = user.DisplayName,
      Token = token
    };
  }
}
