using API.Entities;
using API.Model.DTO;
using API.Model.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserService userService) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
    {
        var users = await userService.GetUsersAsync();
        if (users == null) return NotFound("No users found");
        return Ok(users);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppUser>> GetUser([FromRoute] int id)
    {
        var user = await userService.GetUserAsync(id);
        if (user == null) return NotFound("User not found");
        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AppUser>> CreateUser([FromBody] CreateUserDto userDto)
    {
        if (userDto == null) return BadRequest("Invalid user data");

        var newUser = await userService.CreateUserAsync(userDto);
        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AppUser>> UpdateUser(int id, [FromBody] AppUser user)
    {
        if (id != user.Id) return BadRequest("User ID mismatch");

        var updatedUser = await userService.UpdateUserAsync(user);
        if (updatedUser == null) return NotFound("User not found");
        return Ok(updatedUser);
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AppUser>> DeleteUser(int id)
    {
        var deletedUser = await userService.DeleteUserAsync(id);
        if (deletedUser == null) return NotFound("User not found");
        return Ok(deletedUser);
    }
}