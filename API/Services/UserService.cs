using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Model.DTO.Request;
using API.Interfaces.Repository;
using API.Interfaces.Services;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
  public async Task<UserEntity> CreateUserAsync(CreateUserDto user)
  {
    if (await userRepository.GetByUsernameAsync(user.Username) != null)
      throw new Exception("Username already exists");

    using var hmac = new HMACSHA512();

    var newUser = new UserEntity
    {
      Username = user.Username.ToLower(),
      PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(user.Password)),
      PasswordSalt = hmac.Key
    };
    return await userRepository.CreateUserAsync(newUser);
  }

  public async Task<UserEntity> DeleteUserAsync(int id)
  {
    return await userRepository.DeleteUserAsync(id);
  }

  public async Task<IEnumerable<UserEntity>> GetUsersAsync()
  {
    return await userRepository.GetAllUserAsync();
  }

  public async Task<UserEntity> GetUserAsync(int id)
  {
    return await userRepository.GetByIdUserAsync(id);
  }

  public async Task<UserEntity> UpdateUserAsync(UserEntity user)
  {
    return await userRepository.UpdateUserAsync(user);
  }
}
