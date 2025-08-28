using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IGenerateJWTService
{
    string GenerateToken(string userId);
    Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto token);
    Task<string> GenerateAndSaveTokenAsync(string userId, string accessToken);
    string GetUserIdFromJwt(string jwt);
    string GenerateRefreshToken();
}
