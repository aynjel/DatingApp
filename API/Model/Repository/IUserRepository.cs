using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Model.Repository;

public interface IUserRepository
{
  Task<AppUser> CreateUserAsync(AppUser user);
  Task<AppUser> DeleteUserAsync(int id);
  Task<IEnumerable<AppUser>> GetAllUser();
  Task<AppUser> GetByIdUser(int id);
  Task UpdateUser(AppUser user);
}
