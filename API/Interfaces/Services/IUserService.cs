using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IUserService
{
  Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
  Task<UserDetailsResponseDto> GetUserByIdAsync(string id);
  Task<UserDetailsResponseDto> GetUserByUsernameAsync(string username);
  Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto);
  Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto);
  Task<UserAccountResponseDto> GetLoggedInUserAsync();
}
