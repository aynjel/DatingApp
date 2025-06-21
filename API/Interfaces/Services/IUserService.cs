using API.Entities;
using API.Model.DTO.Request;

namespace API.Interfaces.Services;

public interface IUserService
{
  Task<IEnumerable<UserEntity>> GetUsersAsync();
  Task<UserEntity> GetUserAsync(int id);
  Task<UserEntity> CreateUserAsync(CreateUserRequestDto user);
  Task<UserEntity> UpdateUserAsync(UserEntity user);
  Task<UserEntity> DeleteUserAsync(int id);
}
