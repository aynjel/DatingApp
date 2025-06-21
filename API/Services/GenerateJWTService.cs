using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using API.Interfaces.Services;

namespace API.Services;

public class GenerateJWTService : IGenerateJWTService
{
  public string GenerateJWTToken(string value)
  {
    var claims = new[]
    {
      new Claim(JwtRegisteredClaimNames.Sub, value),
      new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("eqf34f3e-3f4e-4f3e-3f4e-4f3e-3f4e-4f3e"));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "yourdomain.com",
        audience: "yourdomain.com",
        claims: claims,
        expires: DateTime.Now.AddMinutes(30),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
