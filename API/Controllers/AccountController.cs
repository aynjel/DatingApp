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
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserAccountResponseDto>> Register([FromBody] CreateUserRequestDto registerDto)
    {
        var user = await userService.CreateUserAsync(registerDto);
        if (user is null) return BadRequest("Registration failed.");
        return Ok(user);
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserAccountResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        var user = await userService.AuthenticateUserAsync(loginDto);
        if (user is null) return Unauthorized("Invalid email or password.");
        return Ok(user);
    }

    [Authorize]
    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenDto)
    {
        var token = await userService.RefreshTokenAsync(refreshTokenDto);
        if (token is null) return BadRequest("Invalid refresh token.");
        return Ok(token);
    }

    [Authorize]
    [HttpGet("current-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<UserDetailsResponseDto>> GetCurrentUser()
    {
        var jwt = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var user = await userService.GetCurrentUserAsync(jwt);
        if (user is null) return Unauthorized("User not found.");
        return Ok(user);
    }
}
