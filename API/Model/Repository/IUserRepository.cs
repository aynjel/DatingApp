using API.Entities;

namespace API.Model.Repository;

public interface IUserRepository
{
  Task<AppUser> CreateUserAsync(AppUser user);
  Task<AppUser> DeleteUserAsync(int id);
  Task<IEnumerable<AppUser>> GetAllUserAsync();
  Task<AppUser> GetByIdUserAsync(int id);
  Task<AppUser> GetByUsernameAsync(string username);
  Task<AppUser> UpdateUserAsync(AppUser user);
}
