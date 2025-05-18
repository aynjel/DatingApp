using API.Entities;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
  void Update(UserEntity user);
  Task<bool> SaveAllAsync();
  Task<IEnumerable<UserEntity>> GetUsersAsync();
  Task<UserEntity> GetByIdUserAsync(int id);
  Task<UserEntity> GetByUsernameAsync(string username);
}
