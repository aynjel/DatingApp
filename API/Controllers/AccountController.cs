using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController(IUserService userService) : BaseController
{
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserAccountResponseDto>> Register([FromBody] CreateUserRequestDto registerDto)
    {
        var user = await userService.CreateUserAsync(registerDto);
        return Ok(user);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserAccountResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        var user = await userService.AuthenticateUserAsync(loginDto);
        return Ok(user);
    }

    [Authorize]
    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenDto)
    {
        var token = await userService.RefreshTokenAsync(refreshTokenDto);
        return Ok(token);
    }

    [Authorize]
    [HttpGet("current-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserDetailsResponseDto>> GetCurrentUser()
    {
        var jwt = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var user = await userService.GetCurrentUserAsync(jwt);
        return Ok(user);
    }
}
