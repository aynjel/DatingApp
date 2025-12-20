using API.Entities;

namespace API.Model.DTO.Response;

public class UserDetailsResponseDto
{
    public string UserId { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string ImageUrl { get; set; }
    public Member MemberDetails { get; set; }
}
