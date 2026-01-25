using API.Entities;
using API.Interfaces.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Data.Repository;

public class UserRepository(UserManager<User> userManager) : IUserRepository
{
    public async Task<User> GetByIdAsync(string id)
    {
        return await userManager.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User> GetAsync(Expression<Func<User, bool>> expression)
    {
        return await userManager.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .AsNoTracking()
            .FirstOrDefaultAsync(expression);
    }

    public async Task<bool> IsEmailExistsAsync(string email)
    {
        return await userManager.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<IReadOnlyList<User>> GetAllAsync(Expression<Func<User, bool>> expression = null)
    {
        IQueryable<User> query = userManager.Users
            .Include(u => u.Member)
                .ThenInclude(m => m.Photos)
            .AsNoTracking();

        if (expression is not null)
        {
            query = query.Where(expression);
        }

        return await query.ToListAsync();
    }

    public async Task<IdentityResult> AddAsync(User user, string password)
    {
        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, "Member");
        }
        return result;
    }

    public async Task<IdentityResult> UpdateAsync(User user)
    {
        return await userManager.UpdateAsync(user);
    }

    public async Task<bool> CheckPasswordAsync(User user, string password)
    {
        return await userManager.CheckPasswordAsync(user, password);
    }
}
