using API.Entities;

namespace API.Model.Services;

public interface IUserService
{
  Task<IEnumerable<AppUser>> GetUsersAsync();
  Task<AppUser> GetUserAsync(int id);
  Task CreateUserAsync(AppUser user);
  Task UpdateUserAsync(AppUser user);
  Task DeleteUserAsync(int id);
}
