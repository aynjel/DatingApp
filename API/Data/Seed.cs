using System.Security.Cryptography;
using System.Text.Json;
using API.Entities;
using API.Model.DTO;

namespace API.Data;

public class Seed
{
  public static async Task SeedUsers(DataContext context)
  {
    if (context.Users.Any()) return;

    var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
    var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

    if (members is not null)
    {
      foreach (var memberDto in members)
      {
        using var hmac = new HMACSHA512();
        var user = new User
        {
          Id = memberDto.Id,
          Email = memberDto.Email,
          DisplayName = memberDto.DisplayName,
          ImageUrl = memberDto.ImageUrl,
          PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")),
          PasswordSalt = hmac.Key,
        };

        var member = new Member
        {
          Id = memberDto.Id,
          DateOfBirth = memberDto.DateOfBirth,
          ImageUrl = memberDto.ImageUrl ?? string.Empty,
          DisplayName = memberDto.DisplayName,
          Created = memberDto.Created,
          LastActive = memberDto.LastActive,
          Gender = memberDto.Gender,
          Description = memberDto.Description ?? string.Empty,
          City = memberDto.City,
          Country = memberDto.Country
        };

        user.Member = member;
        member.Photos.Add(new Photo
        {
          Url = memberDto.ImageUrl ?? string.Empty,
        });
        context.Users.Add(user);
      }

      await context.SaveChangesAsync();
    }
  }
}
