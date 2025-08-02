using API.Entities;

namespace API.Interfaces.Services;

public interface IUserService
{
  Task<IEnumerable<UserEntity>> GetUsersAsync();
  Task<UserEntity> GetUserByIdAsync(int id);
  Task<UserEntity> GetUserByUsernameAsync(string username);
}
