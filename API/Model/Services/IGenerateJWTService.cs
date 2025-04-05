using System;

namespace API.Model.Services;

public interface IGenerateJWTService
{
  string GenerateJWTToken(string key);
}
