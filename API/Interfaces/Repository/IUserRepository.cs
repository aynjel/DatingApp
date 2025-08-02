using API.Entities;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
  Task<IEnumerable<UserEntity>> GetUsersAsync();
  Task<UserEntity> GetByIdAsync(int id);
  Task<UserEntity> GetByUsernameAsync(string username);
}
