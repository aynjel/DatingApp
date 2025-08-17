using API.Entities;
using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
  Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
  Task<UserDetailsResponseDto> GetByIdAsync(string id);
  Task<UserDetailsResponseDto> GetByUsernameAsync(string username);
  Task<bool> UserExistsAsync(string username, string email);
  Task<UserEntity> CreateUserAsync(UserEntity user);
  Task<UserEntity> GetUserEntityAsync(string id);
  Task<string> GetUserIdByUsernameAsync(string username);
  Task<UserAccountResponseDto> GetUserByIdAsync(string id);
}
