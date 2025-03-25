using API.Entities;
using API.Model.Repository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class UsersController(IUserRepository userRepository) : BaseApiController
{
    // private readonly IUserService _userService = userService;
    private readonly IUserRepository _userRepository = userRepository;

    [HttpGet]
    public async Task<IEnumerable<AppUser>> GetUsers()
    {
        // return await _userService.GetUsersAsync();
        return await _userRepository.GetAllUser();
    }

    // [HttpGet("{id}")]
    // public async Task<AppUser> GetUser(int id)
    // {
    //     return await _userService.GetUserAsync(id);
    // }

    // [HttpPost]
    // public async Task CreateUser(AppUser user)
    // {
    //     await _userService.CreateUserAsync(user);
    // }

    // [HttpPut]
    // public async Task UpdateUser(AppUser user)
    // {
    //     await _userService.UpdateUserAsync(user);
    // }

    // [HttpDelete("{id}")]
    // public async Task DeleteUser(int id)
    // {
    //     await _userService.DeleteUserAsync(id);
    // }
}