using API.Entities;
using API.Model.DTO;
using Microsoft.AspNetCore.Mvc;

namespace API.Model.Services;

public interface IUserService
{
  Task<IEnumerable<AppUser>> GetUsersAsync();
  Task<AppUser> GetUserAsync(int id);
  Task<AppUser> CreateUserAsync(CreateUserDto user);
  Task<AppUser> UpdateUserAsync(AppUser user);
  Task<AppUser> DeleteUserAsync(int id);
}
