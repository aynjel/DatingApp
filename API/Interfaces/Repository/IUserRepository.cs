using API.Entities;
using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
    Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync();
    Task<UserDetailsResponseDto> GetByIdAsync(string id);
    Task<UserAccountResponseDto> GetByEmailAsync(string email);
    Task<bool> UserExistsAsync(string email);
    Task<UserAccountResponseDto> CreateUserAsync(User user);
    Task<UserDetailsResponseDto> UpdateUserAsync(User user);
    Task<(User, UserDetailsResponseDto)> GetUserAsync(string email);
    Task<string> GetUserIdByEmailAsync(string email);
}
