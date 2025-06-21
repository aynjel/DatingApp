using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Entities;
using API.Model.DTO.Request;
using API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(DataContext context, IGenerateJWTService generateJWTService) : ControllerBase
{
    [HttpPost("Login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserEntity>> Login([FromBody] LoginRequestDto loginDto)
    {
        var user = await context.Users.SingleOrDefaultAsync(x => x.Username == loginDto.Username);

        if (user == null) return Unauthorized("Invalid username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }

        return Ok(new
        {
            token = generateJWTService.GenerateJWTToken(user.Username)
        });
    }
}
