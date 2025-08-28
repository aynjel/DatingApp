using API.Entities;
using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
    Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
    Task<UserDetailsResponseDto> GetByIdAsync(string id);
    Task<UserAccountResponseDto> GetByUsernameAsync(string username);
    Task<bool> UserExistsAsync(string username, string email);
    Task<UserAccountResponseDto> CreateUserAsync(User user);
    Task<UserDetailsResponseDto> UpdateUserAsync(User user);
    Task<(User, UserDetailsResponseDto)> GetUserAsync(string id);
    Task<string> GetUserIdByUsernameAsync(string username);
}
