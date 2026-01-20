using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using System.Security.Cryptography;
using System.Text;

namespace API.Services;

public class UserService(IUserRepository userRepository, IGenerateJWTService jwtService, ILogger<UserService> logger) : IUserService
{
    public async Task<IReadOnlyList<UserDetailsResponseDto>> GetAllAsync()
    {
        var users = await userRepository.GetAllAsync();
        return [.. users.Select(u => u.ToDto())];
    }

    public async Task<UserDetailsResponseDto> GetByIdAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user is null)
        {
            logger.LogWarning("User with ID {UserId} not found", id);
            throw new NotFoundException($"User with id '{id}' not found");
        }
        return user.ToDto();
    }

    public async Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto)
    {
        bool isEmailExists = await userRepository.IsEmailExistsAsync(registerDto.Email);
        if (isEmailExists) throw new ConflictException("Email already in use");

        CreatePasswordHash(registerDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        User user = new()
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            Member = new()
            {
                DateOfBirth = DateOnly.FromDateTime(registerDto.DateOfBirth),
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,
                Gender = registerDto.Gender,
                City = registerDto.City,
                Country = registerDto.Country,
                Description = registerDto.Description,
                Interests = [.. registerDto.Interests],
                DisplayName = registerDto.DisplayName,
            }
        };

        userRepository.Add(user);
        
        if(await userRepository.SaveAllAsync())
        {
            string accessToken = jwtService.GenerateToken(user.Id);
            string refreshToken = await jwtService.GenerateAndSaveTokenAsync(user.Id, accessToken);
            return user.ToDto(new TokenResponseDto(accessToken, refreshToken));
        }

        logger.LogError("Failed to create user with email: {Email}", registerDto.Email);
        throw new Exception("Failed to create user");
    }

    public async Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto)
    {
        var user = await userRepository.GetAsync(u => u.Email == loginDto.Email);

        if (user is null)
        {
            logger.LogWarning("Authentication attempt for non-existing email: {Email}", loginDto.Email);
            throw new UnauthorizedException("Invalid credentials");
        }

        if (!VerifyPasswordHash(loginDto.Password, user.PasswordHash, user.PasswordSalt))
        {
            logger.LogWarning("Authentication failed for user with email: {Email}", loginDto.Email);
            throw new UnauthorizedException("Invalid credentials");
        }

        var accessToken = jwtService.GenerateToken(user.Id);
        var refreshToken = await jwtService.GenerateAndSaveTokenAsync(user.Id, accessToken);
        return user.ToDto(new TokenResponseDto(accessToken, refreshToken));
    }

    public async Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto refreshTokenDto)
    {
        return await jwtService.RefreshTokenAsync(refreshTokenDto);
    }

    public async Task<UserDetailsResponseDto> GetCurrentUserAsync(string userId)
    {
        var user = await userRepository.GetByIdAsync(userId) ?? throw new NotFoundException($"User with id '{userId}' not found");
        return user.ToDto();
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
