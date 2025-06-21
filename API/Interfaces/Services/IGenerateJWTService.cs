namespace API.Interfaces.Services;

public interface IGenerateJWTService
{
    string GenerateJWTToken(string key);
}
