using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.Entities;
using API.Model.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(DataContext context)
    {
        if (await context.Users.AnyAsync())
        {
            Console.WriteLine("Database already contains users. Skipping seed.");
            return;
        }

        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        if (members is null || members.Count == 0)
        {
            Console.WriteLine("No member data found to seed.");
            return;
        }

        Console.WriteLine($"Starting to seed {members.Count} users...");

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();
            var user = new User
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl ?? string.Empty,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    Id = member.Id,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl ?? string.Empty,
                    DisplayName = member.DisplayName,
                    Created = member.Created,
                    LastActive = member.LastActive,
                    Gender = member.Gender,
                    Description = member.Description ?? string.Empty,
                    City = member.City,
                    Country = member.Country
                }
            };

            user.Member.Photos.Add(new Photo
            {
                Id = Guid.NewGuid().ToString(),
                Url = member.ImageUrl ?? string.Empty,
                PublicId = string.Empty,
                MemberId = member.Id
            });
            
            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
        Console.WriteLine($"? Successfully seeded {members.Count} users with members and photos.");
    }
}
