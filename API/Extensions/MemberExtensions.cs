using API.Entities;
using API.Model.DTO.Response;

namespace API.Extensions;

public static class MemberExtensions
{
    public static MemberResponseDto ToDto(this Member member)
    {
        return new MemberResponseDto
        {
            Id = member.Id,
            DateOfBirth = member.DateOfBirth,
            ImageUrl = member.ImageUrl,
            DisplayName = member.DisplayName,
            Created = member.Created,
            LastActive = member.LastActive,
            Gender = member.Gender,
            Description = member.Description,
            City = member.City,
            Country = member.Country,
            Photos = member.Photos?.Select(p => p.ToDto()).ToList() ?? new List<PhotoResponseDto>()
        };
    }

    public static PhotoResponseDto ToDto(this Photo photo)
    {
        return new PhotoResponseDto
        {
            Id = photo.Id,
            Url = photo.Url,
            PublicId = photo.PublicId ?? string.Empty,
            MemberId = photo.MemberId
        };
    }
}
