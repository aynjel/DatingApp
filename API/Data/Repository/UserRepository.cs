using API.Entities;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<User> GetByIdAsync(string id)
    {
        return await context.Users.FindAsync(id).AsTask();
    }

    public async Task<User> GetAsync(Expression<Func<User, bool>> expression)
    {
        return await context.Users.AsNoTracking().FirstOrDefaultAsync(expression);
    }
    public async Task<bool> IsEmailExistsAsync(string email)
    {
        return await context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<IReadOnlyList<User>> GetAllAsync()
    {
        return await context.Users.AsNoTracking().ToListAsync();
    }


    public async Task AddAsync(User user)
    {
        //var accessToken = jwtService.GenerateToken(user.Id);
        //var refreshToken = jwtService.GenerateRefreshToken();
        //user.AccessToken = accessToken;
        //user.RefreshToken = refreshToken;
        //user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
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
