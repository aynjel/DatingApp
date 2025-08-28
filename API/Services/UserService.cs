using System.Security.Cryptography;
using System.Text;
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
        var (user, _) = await userRepository.GetByUsernameAsync(username);
        return user;
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
        var user = new Entities.User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Username = registerDto.Username.ToLower(),
            Email = registerDto.Email.ToLower(),
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
        };

        // Save user to database
        var createdUser = await userRepository.CreateUserAsync(user);

        // Return user details response
        return createdUser.ToDto();
    }

    public async Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto)
    {
        // Validate user credentials
        var (userEntity, user) = await userRepository.GetUserAsync(loginDto.Username);
        if (userEntity is null || !VerifyPasswordHash(loginDto.Password, userEntity.PasswordHash, userEntity.PasswordSalt))
        {
            throw new InvalidOperationException("Invalid username or password");
        }

        var accessToken = jwtService.GenerateToken(user);
        var refreshToken = await jwtService.GenerateAndSaveTokenAsync(user, accessToken);

        return user.ToDto(new TokenResponseDto(accessToken, refreshToken));
    }

    public async Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto refreshTokenDto)
    {
        return await jwtService.RefreshTokenAsync(refreshTokenDto);
    }

    public async Task<UserAccountResponseDto> GetCurrentUserAsync(string jwt)
    {
        var username = jwtService.GetUsernameFromJwt(jwt);
        if (username is null)
        {
            return null;
        }

        var (user, token) = await userRepository.GetByUsernameAsync(username);
        if (user is null)
        {
            return null;
        }

        return user.ToDto(token);
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
