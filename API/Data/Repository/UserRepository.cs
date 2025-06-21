using API.Entities;
using API.Interfaces.Repository;

namespace API.Data.Repository;

public class UserRepository(DataContext context) : IUserRepository
{
    Task<UserEntity> IUserRepository.GetByIdUserAsync(int id)
    {
        throw new NotImplementedException();
    }

    Task<UserEntity> IUserRepository.GetByUsernameAsync(string username)
    {
        throw new NotImplementedException();
    }

    Task<IEnumerable<UserEntity>> IUserRepository.GetUsersAsync()
    {
        throw new NotImplementedException();
    }

    Task<bool> IUserRepository.SaveAllAsync()
    {
        throw new NotImplementedException();
    }

    void IUserRepository.Update(UserEntity user)
    {
        throw new NotImplementedException();
    }
}
