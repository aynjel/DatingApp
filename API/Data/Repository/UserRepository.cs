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

    public async Task<bool> UserExistsAsync(string username, string email)
    {
        return await context.Users.AnyAsync(u => u.Username == username || u.Email == email);
    }

    public async Task<UserDetailsResponseDto> CreateUserAsync(User user)
    {
        await context.Users.AddAsync(user);
        await context.SaveChangesAsync();
        var userDto = new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        return userDto;
    }

    public async Task<UserDetailsResponseDto> UpdateUserAsync(User user)
    {
        context.Users.Update(user);
        await context.SaveChangesAsync();
        var userDto = new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        return userDto;
    }

    public async Task<(User, UserDetailsResponseDto)> GetUserAsync(string username)
    {
        var user = await context.Users.SingleOrDefaultAsync(u => u.Username == username);
        if (user == null) return (null, null);
        var userDto = new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        return (user, userDto);
    }

    public async Task<string> GetUserIdByUsernameAsync(string username)
    {
        var user = await context.Users.SingleOrDefaultAsync(u => u.Username == username);
        return user?.Id.ToString();
    }
}
