using API.Entities;
using API.Model.Repository;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
  private readonly DataContext _context = context;

    public async Task<AppUser> CreateUserAsync(AppUser user)
  {
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();
    return user;
  }

  public async Task<AppUser> DeleteUserAsync(int id)
  {
    var user = await _context.Users.FindAsync(id);
    _context.Users.Remove(user);
    await _context.SaveChangesAsync();
    return user;
  }

  public async Task<IEnumerable<AppUser>> GetAllUser()
  {
    return await _context.Users.ToListAsync();
  }

  public async Task<AppUser> GetByIdUser(int id)
  {
    return await _context.Users.FindAsync(id);
  }

  public async Task UpdateUser(AppUser user)
  {
    _context.Users.Update(user);
    await _context.SaveChangesAsync();
  }
}
