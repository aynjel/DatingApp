using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Model.DTO;
using API.Model.Repository;
using API.Model.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
  public async Task<AppUser> CreateUserAsync(CreateUserDto user)
  {
    if (await userRepository.GetByUsernameAsync(user.Username) != null)
      throw new Exception("Username already exists");

    using var hmac = new HMACSHA512();

    var newUser = new AppUser
    {
      Username = user.Username.ToLower(),
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password)),
      PasswordSalt = hmac.Key
    };
    return await userRepository.CreateUserAsync(newUser);
  }

  public async Task<AppUser> DeleteUserAsync(int id)
  {
    return await userRepository.DeleteUserAsync(id);
  }

  public async Task<IEnumerable<AppUser>> GetUsersAsync()
  {
    return await userRepository.GetAllUserAsync();
  }

  public async Task<AppUser> GetUserAsync(int id)
  {
    return await userRepository.GetByIdUserAsync(id);
  }

  public async Task<AppUser> UpdateUserAsync(AppUser user)
  {
    return await userRepository.UpdateUserAsync(user);
  }
}
