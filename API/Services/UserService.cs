using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.Model.DTO.Request;
using API.Interfaces.Repository;
using API.Interfaces.Services;

namespace API.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    Task<UserEntity> IUserService.CreateUserAsync(CreateUserRequestDto user)
    {
        throw new NotImplementedException();
    }

    Task<UserEntity> IUserService.DeleteUserAsync(int id)
    {
        throw new NotImplementedException();
    }

    Task<UserEntity> IUserService.GetUserAsync(int id)
    {
        throw new NotImplementedException();
    }

    Task<IEnumerable<UserEntity>> IUserService.GetUsersAsync()
    {
        throw new NotImplementedException();
    }

    Task<UserEntity> IUserService.UpdateUserAsync(UserEntity user)
    {
        throw new NotImplementedException();
    }
}
