using API.Entities;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<IEnumerable<UserEntity>> GetUsersAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<UserEntity> GetByIdAsync(int id)
    {
        return await context.Users.FindAsync(id);
    }

    public async Task<UserEntity> GetByUsernameAsync(string username)
    {
        return await context.Users.FirstOrDefaultAsync(u => u.Username == username);
    }
}
