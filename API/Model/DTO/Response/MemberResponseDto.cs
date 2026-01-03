namespace API.Model.DTO.Response;

public class MemberResponseDto
{
    public string Id { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string ImageUrl { get; set; }
    public string DisplayName { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public string Gender { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public List<string> Interests { get; set; } = new();
    public List<PhotoResponseDto> Photos { get; set; } = new();
}
