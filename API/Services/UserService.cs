using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Services;

public class UserService(IUserRepository userRepository, IGenerateJWTService jwtService) : IUserService
{
    public async Task<IEnumerable<UserDetailsResponseDto>> GetUsersAsync()
    {
        return await userRepository.GetUsersAsync();
    }

    public async Task<UserDetailsResponseDto> GetUserByIdAsync(string id)
    {
        return await userRepository.GetByIdAsync(id);
    }

    public async Task<UserDetailsResponseDto> GetUserByUsernameAsync(string username)
    {
        return await userRepository.GetByUsernameAsync(username);
    }

    public async Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto)
    {
        // Check if user already exists
        if (await userRepository.UserExistsAsync(registerDto.Username, registerDto.Email))
        {
            throw new InvalidOperationException("Username or email already exists");
        }

        // Create password hash and salt
        CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        // Create user entity
        var user = new UserEntity
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Username = registerDto.Username.ToLower(),
            Email = registerDto.Email.ToLower(),
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };

        // Save user to database
        var createdUser = await userRepository.CreateUserAsync(user);

        // Return user details response
        return createdUser.ToDto(jwtService);
    }

    public async Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto)
    {
        // Validate user credentials
        var userId = await userRepository.GetUserIdByUsernameAsync(loginDto.Username);
        var userEntity = await userRepository.GetUserEntityAsync(userId);
        if (userEntity == null || !VerifyPasswordHash(loginDto.Password, userEntity.PasswordHash, userEntity.PasswordSalt))
        {
            throw new InvalidOperationException("Invalid username or password");
        }

        return userEntity.ToDto(jwtService);
    }

    public async Task<UserAccountResponseDto> GetLoggedInUserAsync()
    {
        // Get user ID from claims
        var userId = ClaimsPrincipal.Current?.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            throw new InvalidOperationException("User is not logged in");
        }

        // Retrieve user by ID
        var user = await userRepository.GetUserByIdAsync(userId);
        if (user is null)
        {
            throw new InvalidOperationException("User not found");
        }

        return user;
    }

    #region Private Methods

    private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using var hmac = new HMACSHA512();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        using var hmac = new HMACSHA512(storedSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computedHash.SequenceEqual(storedHash);
    }

    #endregion
}
