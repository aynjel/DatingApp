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
        try
        {
            var user = await userService.CreateUserAsync(registerDto);
            return Ok(user);
        }
        catch (InvalidOperationException er)
        {
            return BadRequest(er.Message);
        }
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        try
        {
            var token = await userService.AuthenticateUserAsync(loginDto);
            return Ok(token);
        }
        catch (InvalidOperationException er)
        {
            return BadRequest(er.Message);
        }
    }

    [Authorize]
    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<TokenResponseDto>> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenDto)
    {
        try
        {
            var token = await userService.RefreshTokenAsync(refreshTokenDto);
            return Ok(token);
        }
        catch (InvalidOperationException er)
        {
            return BadRequest(er.Message);
        }
    }

    [Authorize]
    [HttpGet("current-user")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserAccountResponseDto>> GetCurrentUser()
    {
        var jwt = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
        var user = await userService.GetCurrentUserAsync(jwt);
        if (user is null)
        {
            return NotFound("User not found");
        }
        return Ok(user);
    }
}
