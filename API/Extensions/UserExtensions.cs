using API.Entities;
using API.Interfaces.Services;
using API.Model.DTO.Response;

namespace API.Extensions;

public static class UserExtensions
{
  public static UserAccountResponseDto ToDto(this UserEntity user, IGenerateJWTService jwtTokenService)
  {
    return new UserAccountResponseDto
    {
      UserId = user.Id,
      FirstName = user.FirstName,
      LastName = user.LastName,
      Username = user.Username,
      Email = user.Email,
      Token = jwtTokenService.GenerateToken(user),
      Expiration = DateTime.UtcNow.AddHours(1) // Set token expiration to 1 hour
    };
  }
}
