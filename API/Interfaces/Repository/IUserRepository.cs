using API.Entities;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
    Task<User> GetByIdAsync(string id);
    Task<User> GetAsync(Expression<Func<User, bool>> expression);
    Task<bool> IsEmailExistsAsync(string email);
    Task<IReadOnlyList<User>> GetAllAsync(Expression<Func<User, bool>> expression = null);
    Task<IdentityResult> AddAsync(User user, string password);
    Task<IdentityResult> UpdateAsync(User user);
    Task<bool> CheckPasswordAsync(User user, string password);
}
