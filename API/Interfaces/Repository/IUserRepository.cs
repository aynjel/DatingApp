using API.Entities;
using System.Linq.Expressions;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
    Task<User> GetByIdAsync(string id);
    Task<User> GetAsync(Expression<Func<User, bool>> expression);
    Task<bool> IsEmailExistsAsync(string email);
    Task<IReadOnlyList<User>> GetAllAsync();
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(User user);
}
