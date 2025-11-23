using API.Entities;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Response;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UserRepository(DataContext context, IGenerateJWTService jwtService) : IUserRepository
{
    public async Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync()
    {
        return await context.Users
            .Select(u => new UserDetailsResponseDto
            {
                UserId = u.Id,
                DisplayName = u.DisplayName,
                Email = u.Email
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
            DisplayName = user.DisplayName,
            Email = user.Email
        };
    }

    public async Task<UserAccountResponseDto> GetByEmailAsync(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null) return null;

        var token = new TokenResponseDto(user.AccessToken, user.RefreshToken);
        var userDetails = new UserDetailsResponseDto
        {
            UserId = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email
        };

        return userDetails.ToDto(token);
    }

    public async Task<bool> UserExistsAsync(string email)
    {
        return await context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<UserAccountResponseDto> CreateUserAsync(User user)
    {
        if (user is null) return null;
        var accessToken = jwtService.GenerateToken(user.Id);
        var refreshToken = jwtService.GenerateRefreshToken();
        user.AccessToken = accessToken;
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        context.Users.Add(user);
        await context.SaveChangesAsync();
        var userDto = new UserAccountResponseDto
        {
            UserId = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = new TokenResponseDto(accessToken, refreshToken)
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
            DisplayName = user.DisplayName,
            Email = user.Email
        };
        return userDto;
    }

    public async Task<(User, UserDetailsResponseDto)> GetUserAsync(string email)
    {
        var user = await context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null) return (null, null);
        var userDto = new UserDetailsResponseDto
        {
            UserId = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email
        };
        return (user, userDto);
    }

    public async Task<string> GetUserIdByEmailAsync(string email)
    {
        var user = await context.Users.SingleOrDefaultAsync(u => u.Email == email);
        return user?.Id.ToString();
    }
}
