using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Response;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync()
    {
        return await userRepository.GetUsersAsync();
    }

    public async Task<UserDetailsResponseDto> GetUserByIdAsync(string id)
    {
        return await userRepository.GetByIdAsync(id);
    }

    public async Task<UserDetailsResponseDto> GetUserByUsernameAsync(string username)
    {
        return await userRepository.GetByUsernameAsync(username);
    }
}
