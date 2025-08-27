using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IGenerateJWTService
{
    string GenerateToken(UserDetailsResponseDto key);
    Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto token);
    Task<string> GenerateAndSaveTokenAsync(UserDetailsResponseDto user, string accessToken);
}
