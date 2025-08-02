using API.Entities;
using API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserService userService, ILogger<UsersController> logger) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<UserEntity>>> GetUsers()
    {
        var users = await userService.GetUsersAsync();
        if (users is null) return NotFound("No users found");
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserEntity>> GetUser([FromRoute] int id)
    {
        var user = await userService.GetUserByIdAsync(id);
        if (user is null) return NotFound("User not found");
        return Ok(user);
    }

    [HttpGet("username/{username}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserEntity>> GetUserByUsername([FromRoute] string username)
    {
        try
        {
            var user = await userService.GetUserByUsernameAsync(username);
            if (user is null) return NotFound("User not found");
            return Ok(user);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving user by username");
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}
