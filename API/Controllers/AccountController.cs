using API.Entities;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController(IUserService userService) : BaseController
{
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserEntity>> Register([FromBody] CreateUserRequestDto registerDto)
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
    public async Task<ActionResult<string>> Login([FromBody] LoginRequestDto loginDto)
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
}
