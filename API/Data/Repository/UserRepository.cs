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

  public async Task<IEnumerable<AppUser>> GetAllUserAsync()
  {
    return await _context.Users.ToListAsync();
  }

  public async Task<AppUser> GetByIdUserAsync(int id)
  {
    return await _context.Users.FindAsync(id);
  }

  public async Task<AppUser> GetByUsernameAsync(string username)
  {
    return await _context.Users.SingleOrDefaultAsync(x => x.Username == username.ToLower());
  }

  public async Task<AppUser> UpdateUserAsync(AppUser user)
  {
    var existingUser = await _context.Users.FindAsync(user.Id);
    if (existingUser == null) return null;

    existingUser.Username = user.Username.ToLower();
    existingUser.PasswordHash = user.PasswordHash;
    existingUser.PasswordSalt = user.PasswordSalt;

    _context.Users.Update(existingUser);
    await _context.SaveChangesAsync();
    return existingUser;
  }
}
