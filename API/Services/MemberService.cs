using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Helpers;
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
        var user = await userRepository.GetByIdAsync(userId) ?? throw new NotFoundException($"User with ID {userId} not found");
        var existingMember = await memberRepository.GetMemberByIdAsync(userId);
        if (existingMember is not null)
        {
            throw new ConflictException($"Member details already exist for user {userId}. Use update endpoint instead.");
        }

        user.ImageUrl = "https://ui-avatars.com/api/?name=" + user.DisplayName;
        await userRepository.UpdateAsync(user);
        var member = new Member
        {
            Id = userId,
            DateOfBirth = memberDetails.DateOfBirth,
            Description = memberDetails.Description,
            City = memberDetails.City,
            Country = memberDetails.Country,
            Gender = memberDetails.Gender,
            Interests = memberDetails.Interests,
            Created = DateTime.UtcNow,
            LastActive = DateTime.UtcNow,
            DisplayName = user.DisplayName,
            ImageUrl = user.ImageUrl,
        };

        await memberRepository.AddAsync(member);
        return member.ToDto();
    }

    public async Task<MemberResponseDto> UpdateMemberDetails(string userId, MemberDetailsRequestDto memberDetails)
    {
        var existingMember = await memberRepository.GetMemberByIdAsync(userId) ?? throw new NotFoundException($"Member details not found for user {userId}. Create member details first.");

        // Update member details
        existingMember.DisplayName = existingMember.DisplayName;
        existingMember.DateOfBirth = memberDetails.DateOfBirth;
        existingMember.Description = memberDetails.Description;
        existingMember.City = memberDetails.City;
        existingMember.Country = memberDetails.Country;
        existingMember.Gender = memberDetails.Gender;
        existingMember.Interests = memberDetails.Interests;
        existingMember.LastActive = DateTime.UtcNow;

        memberRepository.Update(existingMember);
        if (await memberRepository.SaveAllAsync())
        {
            var updatedMember = await memberRepository.GetMemberByIdAsync(userId);
            return updatedMember.ToDto();
        }

        throw new Exception("Failed to update member details");
    }

    public async Task<MemberResponseDto> GetMemberByIdAsync(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);
        return member.ToDto();
    }

    public async Task<PagedList<MemberResponseDto>> GetMembersAsync(string searchTerm, PaginationParams paginationParams)
    {
        var pagedMembers = await memberRepository.GetMembersAsync(searchTerm, paginationParams);
        var memberDtos = pagedMembers.Items.Select(m => m.ToDto()).ToList();
        return new PagedList<MemberResponseDto>(
            memberDtos,
            pagedMembers.TotalCount,
            pagedMembers.PageNumber,
            pagedMembers.PageSize
        );
    }

    public async Task<IReadOnlyList<PhotoResponseDto>> GetPhotosByMemberIdAsync(string memberId)
    {
        var photos = await memberRepository.GetPhotosByMemberIdAsync(memberId);
        return photos.Select(p => p.ToDto()).ToList();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await memberRepository.SaveAllAsync();
    }

    public async Task<Photo> AddPhotoAsync(string memberId, Photo photo)
    {
        var member = await memberRepository.GetMemberByIdAsync(memberId) ?? throw new NotFoundException($"Member with ID {memberId} not found");

        // Check if member has a profile image, if not set this photo as profile image
        if (string.IsNullOrEmpty(member.ImageUrl))
        {
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
        }

        member.Photos.Add(photo);
        memberRepository.Update(member);
        
        await memberRepository.SaveAllAsync();
        return photo;
    }

    #region Private Helper Methods

    private static void AddPhotosToMember(Member member, List<string> photoUrls)
    {
        if (photoUrls != null || photoUrls.Count > 0)
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
    }

    #endregion
}
