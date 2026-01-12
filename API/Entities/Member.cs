using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public required string DisplayName { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; }
    public string Description { get; set; } = string.Empty;
    public required string City { get; set; }
    public required string Country { get; set; }

    // Interests stored as JSON array in database
    public List<string> Interests { get; set; } = [];

    [JsonIgnore]
    public List<Photo> Photos { get; set; } = [];

    [JsonIgnore]
    public List<Message> MessagesSent { get; set; } = [];

    [JsonIgnore]
    public List<Message> MessagesReceived { get; set; } = [];

    [JsonIgnore]
    [ForeignKey(nameof(Id))]
    public User User { get; set; } = null!;
}
