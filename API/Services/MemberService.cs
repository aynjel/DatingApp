using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class MemberService(IMemberRepository memberRepository, IUserRepository userRepository) : IMemberService
{
    public async Task<MemberResponseDto> CreateMemberDetails(string userId, MemberDetailsRequestDto memberDetails)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"User with ID {userId} not found");
        }

        var existingMember = await memberRepository.GetMemberByIdAsync(userId);
        if (existingMember is not null)
        {
            throw new ConflictException($"Member details already exist for user {userId}. Use update endpoint instead.");
        }

        user.ImageUrl = memberDetails.ImageUrl;
        await userRepository.UpdateAsync(user);

        var member = new Member
        {
            Id = userId,
            DisplayName = memberDetails.DisplayName,
            DateOfBirth = memberDetails.DateOfBirth,
            Description = memberDetails.Description,
            ImageUrl = memberDetails.ImageUrl,
            City = memberDetails.City,
            Country = memberDetails.Country,
            Gender = memberDetails.Gender,
            Created = DateTime.UtcNow,
            LastActive = DateTime.UtcNow,
            Photos = new List<Photo>()
        };

        AddPhotosToMember(member, memberDetails.PhotoUrls, memberDetails.ImageUrl);

        await memberRepository.AddAsync(member);
        return member.ToDto();
    }

    public async Task<MemberResponseDto> UpdateMemberDetails(string userId, MemberDetailsRequestDto memberDetails)
    {
        var user = await userRepository.GetByIdAsync(userId);
        if (user is null)
        {
            throw new NotFoundException($"User with ID {userId} not found");
        }

        var existingMember = await memberRepository.GetMemberByIdAsync(userId);
        if (existingMember is null)
        {
            throw new NotFoundException($"Member details not found for user {userId}. Create member details first.");
        }

        // Update user profile image
        user.ImageUrl = memberDetails.ImageUrl;
        await userRepository.UpdateAsync(user);

        // Update member details
        existingMember.DisplayName = memberDetails.DisplayName;
        existingMember.DateOfBirth = memberDetails.DateOfBirth;
        existingMember.Description = memberDetails.Description;
        existingMember.ImageUrl = memberDetails.ImageUrl;
        existingMember.City = memberDetails.City;
        existingMember.Country = memberDetails.Country;
        existingMember.Gender = memberDetails.Gender;
        existingMember.LastActive = DateTime.UtcNow;

        // Handle photos update
        if (memberDetails.PhotoUrls != null && memberDetails.PhotoUrls.Any())
        {
            // Remove existing photos
            existingMember.Photos.Clear();
            
            // Add new photos
            AddPhotosToMember(existingMember, memberDetails.PhotoUrls, memberDetails.ImageUrl);
        }

        memberRepository.Update(existingMember);
        await memberRepository.SaveAllAsync();

        // Reload member with photos to return updated data
        var updatedMember = await memberRepository.GetMemberByIdAsync(userId);
        return updatedMember.ToDto();
    }

    public async Task<MemberResponseDto> GetMemberByIdAsync(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);
        return member?.ToDto();
    }

    public async Task<IReadOnlyList<MemberResponseDto>> GetMembersAsync()
    {
        var members = await memberRepository.GetMembersAsync();
        return members.Select(m => m.ToDto()).ToList();
    }

    public async Task<IReadOnlyList<PhotoResponseDto>> GetPhotosByMemberIdAsync(string memberId)
    {
        var photos = await memberRepository.GetPhotosByMemberIdAsync(memberId);
        return photos.Select(p => p.ToDto()).ToList();
    }

    #region Private Helper Methods

    private static void AddPhotosToMember(Member member, List<string> photoUrls, string defaultImageUrl)
    {
        if (photoUrls != null && photoUrls.Any())
        {
            foreach (var photoUrl in photoUrls)
            {
                member.Photos.Add(new Photo
                {
                    Id = Guid.NewGuid().ToString(),
                    Url = photoUrl,
                    PublicId = string.Empty,
                    MemberId = member.Id
                });
            }
        }
        else
        {
            // Add default profile image as first photo
            member.Photos.Add(new Photo
            {
                Id = Guid.NewGuid().ToString(),
                Url = defaultImageUrl,
                PublicId = string.Empty,
                MemberId = member.Id
            });
        }
    }

    #endregion
}
