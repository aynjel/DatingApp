using System.Security.Cryptography;
using System.Text.Json;
using API.Entities;
using API.Model.DTO;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<User> context)
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
            var user = new User
            {
                Id = member.Id,
                Email = member.Email,
                UserName = member.Email,
                DisplayName = member.DisplayName,
                Member = new Member()
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
                Url = member.ImageUrl,
                PublicId = string.Empty,
                MemberId = member.Id
            });
            
            var result = await context.CreateAsync(user, "P@ssword!");
            if (!result.Succeeded)
            {
                Console.WriteLine($"Failed to create user {member.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
            
            await context.AddToRoleAsync(user, "Member");
        }

        var admin = new User
        {
            UserName = "admin@test.com",
            DisplayName = "Admin User",
            Email = "admin@test.com"
        };

        await context.CreateAsync(admin, "P@ssword!");
        await context.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}
