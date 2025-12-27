using API.Entities;
using API.Model.DTO.Response;

namespace API.Extensions;

public static class UserExtensions
{
    public static UserAccountResponseDto ToDto(this User user, TokenResponseDto token = null)
    {
        return new UserAccountResponseDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email,
            Token = token
        };
    }

    public static UserDetailsResponseDto ToDto(this User user)
    {
        return new UserDetailsResponseDto
        {
            UserId = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            MemberDetails = user.Member?.ToDto()
        };
    }
}
