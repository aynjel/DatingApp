using API.Entities;
using System.Linq.Expressions;

namespace API.Interfaces.Repository;

public interface IUserRepository
{
    Task<User> GetByIdAsync(string id);
    Task<User> GetAsync(Expression<Func<User, bool>> expression);
    Task<bool> IsEmailExistsAsync(string email);
    Task<IReadOnlyList<User>> GetAllAsync(Expression<Func<User, bool>> expression = null);
    void Add(User user);
    void Update(User user);
    Task<bool> SaveAllAsync();
}
