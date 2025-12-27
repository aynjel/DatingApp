using API.Entities;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<User> GetByIdAsync(string id)
    {
        return await context.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> GetAsync(Expression<Func<User, bool>> expression)
    {
        return await context.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .AsNoTracking()
            .FirstOrDefaultAsync(expression);
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        return await context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<IReadOnlyList<User>> GetAllAsync()
    {
        return await context.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }
}
