using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class UsersController(DataContext context) : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<AppUser>>> Index()
    {
        var users = await context.Users.ToListAsync();
        return Ok(users);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AppUser>> Show(int id)
    {
        var user = await context.Users.FindAsync(id);
        if(user == null) return NotFound();

        return Ok(user);
    }

    [HttpPost("create")]
    public async Task<ActionResult> Create(AppUser user)
    {
        var newUser = await context.Users.AddAsync(user);
        await context.SaveChangesAsync();

        return Ok(newUser.Entity);
    }

    // [HttpDelete]
    // public async Task<ActionResult> Delete(int id)
    // {
    //     var user = await context.Users.
    // }
}