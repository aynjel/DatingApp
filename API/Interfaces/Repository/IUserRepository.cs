using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
  Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
  Task<UserDetailsResponseDto> GetByIdAsync(string id);
  Task<UserDetailsResponseDto> GetByUsernameAsync(string username);
}
