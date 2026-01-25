using API.Entities;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IUserService
{
    Task<IReadOnlyList<UserDetailsResponseDto>> GetAllAsync();
    Task<UserDetailsResponseDto> GetByIdAsync(string id);
    Task<User> GetByEmailAsync(string email);
    Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto);
    Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto);
    Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto refreshTokenDto);
    Task<UserDetailsResponseDto> GetCurrentUserAsync(string userId);
}
