using API.Entities;
using API.Interfaces.Repository;
using API.Model.DTO.Response;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync()
    {
        return await context.Users
            .Select(u => new UserDetailsResponseDto
            {
                UserId = u.Id,
                Username = u.Username,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName
            })
            .ToListAsync();
    }

    public async Task<UserDetailsResponseDto> GetByIdAsync(string id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }

    public async Task<UserDetailsResponseDto> GetByUsernameAsync(string username)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null) return null;

        return new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
    }
}
