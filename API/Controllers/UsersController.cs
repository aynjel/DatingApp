using API.Entities;
using API.Model.DTO.Request;
using API.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<UserEntity>>> GetUsers()
    {
        var users = await userService.GetUsersAsync();
        if (users == null) return NotFound("No users found");
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserEntity>> GetUser([FromRoute] int id)
    {
        var user = await userService.GetUserAsync(id);
        if (user == null) return NotFound("User not found");
        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserEntity>> CreateUser([FromBody] CreateUserDto userDto)
    {
        if (userDto == null) return BadRequest("Invalid user data");

        var newUser = await userService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserEntity>> UpdateUser(int id, [FromBody] UserEntity user)
    {
        if (id != user.Id) return BadRequest("User ID mismatch");

        var updatedUser = await userService.UpdateUserAsync(user);
        if (updatedUser == null) return NotFound("User not found");
        return Ok(updatedUser);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserEntity>> DeleteUser(int id)
    {
        var deletedUser = await userService.DeleteUserAsync(id);
        if (deletedUser == null) return NotFound("User not found");
        return Ok(deletedUser);
    }
}