using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class User : IdentityUser
{
    public required string DisplayName { get; set; }
    public string RefreshToken { get; set; } = string.Empty;
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public Member Member { get; set; } = null!;
}
