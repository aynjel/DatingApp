using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IUserService
{
    Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
    Task<UserDetailsResponseDto> GetUserByIdAsync(string id);
    Task<UserDetailsResponseDto> GetUserByEmailAsync(string email);
    Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto);
    Task<TokenResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto);
    Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto refreshTokenDto);
    Task<UserDetailsResponseDto> GetCurrentUserAsync(string jwt);
}
