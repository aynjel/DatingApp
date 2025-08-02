using API.Entities;
using API.Interfaces.Repository;
using API.Interfaces.Services;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    public async Task<IEnumerable<UserEntity>> GetUsersAsync()
    {
        return await userRepository.GetUsersAsync();
    }

    public async Task<UserEntity> GetUserByIdAsync(int id)
    {
        return await userRepository.GetByIdAsync(id);
    }

    public async Task<UserEntity> GetUserByUsernameAsync(string username)
    {
        return await userRepository.GetByUsernameAsync(username);
    }
}
