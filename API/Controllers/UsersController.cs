using API.Interfaces.Services;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserService userService, ILogger<UsersController> logger) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<UserDetailsResponseDto>>> GetUsers()
    {
        try
        {
            var users = await userService.GetUsersAsync();
            if (users is null || !users.Any()) return NotFound("No users found");
            return Ok(users);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving users");
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDetailsResponseDto>> GetUser([FromRoute] string id)
    {
        try
        {
            var user = await userService.GetUserByIdAsync(id);
            if (user is null) return NotFound($"User with ID {id} not found");
            return Ok(user);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving user by ID");
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }

    [HttpGet("username/{username}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDetailsResponseDto>> GetUserByUsername([FromRoute] string username)
    {
        try
        {
            var user = await userService.GetUserByUsernameAsync(username);
            if (user is null) return NotFound($"User with username {username} not found");
            return Ok(user);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving user by username");
            return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        }
    }
}
