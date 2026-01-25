using API.Entities;
using API.Model.DTO.Response;

namespace API.Model.DTO.Response;

public class UserDetailsResponseDto
{
    public string UserId { get; set; }
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public MemberResponseDto MemberDetails { get; set; }
}
