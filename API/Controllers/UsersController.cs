using API.Entities;
using API.Model.Services;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    private readonly IUserService _userService = userService;

    [HttpGet]
    public IEnumerable<AppUser> GetUsers()
    {
        return _userService.GetUsers();
    }

    [HttpGet("{id}")]
    public async Task<AppUser> GetUser(int id)
    {
        return await _userService.GetUserAsync(id);
    }

    [HttpPost]
    public async Task CreateUser(AppUser user)
    {
        await _userService.CreateUserAsync(user);
    }

    [HttpPut]
    public async Task UpdateUser(AppUser user)
    {
        await _userService.UpdateUserAsync(user);
    }

    [HttpDelete("{id}")]
    public async Task DeleteUser(int id)
    {
        await _userService.DeleteUserAsync(id);
    }
}