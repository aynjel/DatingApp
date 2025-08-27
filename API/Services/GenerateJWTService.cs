using API.Data;
using API.Data.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Services;

public class GenerateJWTService(DataContext context, IConfiguration config) : IGenerateJWTService
{
    public string GenerateToken(UserDetailsResponseDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JwtConfig:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.UserId),
            new(ClaimTypes.Name, user.Username)
        };
        var tokenDescriptor = new JwtSecurityToken(
            issuer: config["JwtConfig:Issuer"], 
            audience: config["JwtConfig:Audience"], 
            claims: claims, 
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public async Task<TokenResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
        if (user is null || user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Invalid or expired refresh token");
        }
        // Generate new JWT
        var userDetails = new UserDetailsResponseDto
        {
            UserId = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName
        };
        var newJwtToken = GenerateToken(userDetails);
        var newRefreshToken = await GenerateAndSaveTokenAsync(userDetails, newJwtToken);
        return new TokenResponseDto(newJwtToken, user.RefreshToken);
    }

    public async Task<string> GenerateAndSaveTokenAsync(UserDetailsResponseDto user, string accessToken)
    {
        var refreshToken = GenerateRefreshToken();
        var userEntity = await context.Users.FirstOrDefaultAsync(u => u.Id == user.UserId);
        userEntity.AccessToken = accessToken;
        userEntity.RefreshToken = refreshToken;
        userEntity.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();
        return refreshToken;
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}