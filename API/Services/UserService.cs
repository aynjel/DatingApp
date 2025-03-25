using API.Entities;
using API.Model.Repository;
using API.Model.Services;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
  private readonly IUserRepository _userRepository = userRepository;

  public async Task CreateUserAsync(AppUser user)
  {
    await _userRepository.CreateUserAsync(user);
  }

  public async Task DeleteUserAsync(int id)
  {
    await _userRepository.DeleteUserAsync(id);
  }

  public async Task<IEnumerable<AppUser>> GetUsersAsync()
  {
    return await _userRepository.GetAllUser();
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
