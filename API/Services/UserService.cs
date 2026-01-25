using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Identity;
using System.Linq.Expressions;

namespace API.Services;

public class UserService(IUserRepository userRepository, IMemberRepository memberRepository, ITokenService jwtService, ILogger<UserService> logger) : IUserService
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

    public async Task<User> GetByEmailAsync(string email)
    {
        var user = await userRepository.GetAsync(u => u.Email == email);
        if (user is null)
        {
            logger.LogWarning("User with email {Email} not found", email);
            throw new NotFoundException($"User with email '{email}' not found");
        }
        return user;
    }

    public async Task<UserAccountResponseDto> CreateUserAsync(CreateUserRequestDto registerDto)
    {
        bool isEmailExists = await userRepository.IsEmailExistsAsync(registerDto.Email);
        if (isEmailExists) throw new ConflictException("Email already in use");

        var user = new User()
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email.ToLower(),
            UserName = registerDto.Email.ToLower(),
        };

        var result = await userRepository.AddAsync(user, registerDto.Password);
        if (result.Succeeded) 
        {
            var member = new Member
            {
                Id = user.Id,
                DateOfBirth = registerDto.DateOfBirth,
                Description = registerDto.Description,
                City = registerDto.City,
                Country = registerDto.Country,
                Gender = registerDto.Gender,
                Interests = registerDto.Interests,
                Created = DateTime.UtcNow,
                LastActive = DateTime.UtcNow,
                DisplayName = registerDto.DisplayName,
            };
            memberRepository.Add(member);
            if (await memberRepository.SaveAllAsync())
            {
                var tokenResponse = await GenerateTokenResponseAsync(user);
                return user.ToDto(tokenResponse);
            }

            throw new Exception("Failed to create member profile for the user");
        }
        
        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        logger.LogError("User creation failed: {Errors}", errors);
        throw new Exception("User creation failed: " + errors);
    }

    public async Task<UserAccountResponseDto> AuthenticateUserAsync(LoginRequestDto loginDto)
    {
        var user = await userRepository.GetAsync(u => u.Email == loginDto.Email);
        if (user is null)
        {
            logger.LogWarning("Authentication attempt for non-existing email: {Email}", loginDto.Email);
            throw new UnauthorizedException("Account does not exist");
        }

        var result = await userRepository.CheckPasswordAsync(user, loginDto.Password);
        if (!result)
        {
            logger.LogWarning("Invalid password attempt for email: {Email}", loginDto.Email);
            throw new UnauthorizedException("Invalid credentials");
        }

        var tokenResponse = await GenerateTokenResponseAsync(user);
        return user.ToDto(tokenResponse);
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

    private async Task<TokenResponseDto> GenerateTokenResponseAsync(User user)
    {
        var accessToken = await jwtService.GenerateTokenAsync(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        return new TokenResponseDto(accessToken, refreshToken);
    }
}
