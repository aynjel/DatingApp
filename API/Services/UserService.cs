using API.Entities;
using API.Model.Repository;
using API.Model.Services;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
  private readonly IUserRepository _userRepository = userRepository;

    public async Task CreateUserAsync(AppUser user)
  {
    await _userRepository.CreateUser(user);
  }

  public async Task DeleteUserAsync(int id)
  {
    await _userRepository.DeleteUser(id);
  }

    public IEnumerable<AppUser> GetUsers()
    {
        var users = new List<AppUser>() {
      new AppUser() { Id = 1, Username = "User1" },
      new AppUser() { Id = 2, Username = "User2" },
      new AppUser() { Id = 3, Username = "User3" }
    };
        return users;
    }

    public async Task<AppUser> GetUserAsync(int id)
  {
    return await _userRepository.GetByIdUser(id);
  }

  public async Task UpdateUserAsync(AppUser user)
  {
    await _userRepository.UpdateUser(user);
  }
}
