using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IUserService
{
  Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
  Task<UserDetailsResponseDto> GetUserByIdAsync(string id);
  Task<UserDetailsResponseDto> GetUserByUsernameAsync(string username);
  Task<UserDetailsResponseDto> CreateUserAsync(CreateUserRequestDto registerDto);
  Task<LoginDetailsResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto);
}
