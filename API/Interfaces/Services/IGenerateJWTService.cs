using API.Entities;

namespace API.Interfaces.Services;

public interface IGenerateJWTService
{
    string GenerateToken(UserEntity key);
}
