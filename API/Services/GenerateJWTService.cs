using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using API.Interfaces.Services;
using API.Entities;

namespace API.Services;

public class GenerateJWTService(IConfiguration config) : IGenerateJWTService
{
  public string GenerateToken(UserEntity user)
  {
    var tokenKey = config["TokenKey"] ?? throw new Exception("TokenKey is not configured in appsettings.json");
    if (tokenKey.Length < 64)
    {
      throw new Exception("TokenKey must be at least 64 characters long");
    }
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
    var claims = new List<Claim>
    {
      new(ClaimTypes.Email, user.Email),
      new(ClaimTypes.NameIdentifier, user.Id),
    };

    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(claims),
      Expires = DateTime.UtcNow.AddHours(1),
      SigningCredentials = creds
    };

    var tokenHandler = new JwtSecurityTokenHandler();
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
  }
}