using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Model.Repository;

public interface IUserRepository
{
  Task CreateUser(AppUser user);
  Task DeleteUser(int id);
  Task<IEnumerable<AppUser>> GetAllUser();
  Task<AppUser> GetByIdUser(int id);
  Task UpdateUser(AppUser user);
}
