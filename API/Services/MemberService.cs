using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Params;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Services;

public class MemberService(IMemberRepository memberRepository, IUserRepository userRepository, IPhotoService photoService, ILogger<MemberService> logger) : IMemberService
{
    public async Task<User> CreateMemberDetails(string userId, MemberDetailsRequestDto memberDetails)
    {
        var user = await userRepository.GetByIdAsync(userId) ?? throw new NotFoundException($"User ID {userId} not found");
            
        var existingMember = await memberRepository.GetMemberByIdAsync(userId);
        if (existingMember is not null) throw new ConflictException($"Member already exist for user {userId}");

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
        };

        memberRepository.Add(member);

        if (await memberRepository.SaveAllAsync()) return user;

        throw new BadRequestException("Failed to create member details");
    }

    public async Task<MemberResponseDto> UpdateMemberDetails(string userId, MemberDetailsRequestDto memberDetails)
    {
        var existingMember = await memberRepository.GetMemberByIdAsync(userId) 
            ?? throw new NotFoundException($"Member details not found for user {userId}. Create member details first.");

        existingMember.DateOfBirth = memberDetails.DateOfBirth;
        existingMember.Description = memberDetails.Description;
        existingMember.City = memberDetails.City;
        existingMember.Country = memberDetails.Country;
        existingMember.Gender = memberDetails.Gender;
        existingMember.Interests = memberDetails.Interests;
        existingMember.LastActive = DateTime.UtcNow;

        memberRepository.Update(existingMember);
        
        if (!await memberRepository.SaveAllAsync())
        {
            logger.LogError("Failed to save member details update for user {UserId}", userId);
            throw new BadRequestException("Failed to update member details");
        }

        var updatedMember = await memberRepository.GetMemberByIdAsync(userId);
        return updatedMember!.ToDto();
    }

    public async Task<MemberResponseDto> GetMemberByIdAsync(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id)
            ?? throw new NotFoundException($"Member with ID {id} not found");
            
        return member.ToDto();
    }

    public async Task<PagedList<MemberResponseDto>> GetMembersAsync(MemberParams memberParams, string currentUserId)
    {
        var pagedMembers = await memberRepository.GetMembersAsync(memberParams, currentUserId);
        var members = pagedMembers.Items.Select(m => m.ToDto()).ToList();
        
        return new PagedList<MemberResponseDto>(
            members,
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

    public async Task<bool> AddPhotoAsync(string memberId, Photo photo)
    {
        var member = await memberRepository.GetMemberByIdAsync(memberId) 
            ?? throw new NotFoundException($"Member with ID {memberId} not found");

        foreach (var p in member.Photos)
        {
            p.IsMain = false;
        }
        
        photo.IsMain = true;
        member.ImageUrl = photo.Url;

        member.Photos.Add(photo);
        memberRepository.Update(member);

        return await memberRepository.SaveAllAsync();
    }

    public async Task<IReadOnlyList<Photo>> AddPhotosAsync(string memberId, List<Photo> photos)
    {
        if (photos == null || photos.Count == 0)
            throw new BadRequestException("No photos provided");

        var member = await memberRepository.GetMemberByIdAsync(memberId) 
            ?? throw new NotFoundException($"Member with ID {memberId} not found");

        var isFirstBatch = member.Photos.Count == 0;
        var hasNoImageUrl = string.IsNullOrEmpty(member.ImageUrl);

        foreach (var photo in photos)
        {
            if (isFirstBatch && photo == photos.First())
            {
                photo.IsMain = true;
                member.ImageUrl = photo.Url;
                isFirstBatch = false;
            }
            else if (hasNoImageUrl && photo == photos.First())
            {
                photo.IsMain = true;
                member.ImageUrl = photo.Url;
                hasNoImageUrl = false;
            }
            else
            {
                photo.IsMain = false;
            }

            member.Photos.Add(photo);
        }

        memberRepository.Update(member);
        await memberRepository.SaveAllAsync();
        
        return photos;
    }

    public async Task<bool> SetMainPhotoAsync(string memberId, string photoId)
    {
        var member = await memberRepository.GetMemberByIdAsync(memberId) 
            ?? throw new NotFoundException($"Member with ID {memberId} not found");

        var photo = member.Photos.FirstOrDefault(p => p.Id == photoId)
            ?? throw new NotFoundException($"Photo with ID {photoId} not found");

        if (photo.IsMain)
            throw new BadRequestException("This is already the main photo");

        foreach (var p in member.Photos)
        {
            p.IsMain = false;
        }

        photo.IsMain = true;
        member.ImageUrl = photo.Url;

        memberRepository.Update(member);
        return await memberRepository.SaveAllAsync();
    }

    public async Task<bool> DeletePhotoAsync(string memberId, string photoId)
    {
        var member = await memberRepository.GetMemberByIdAsync(memberId)
            ?? throw new NotFoundException($"Member with ID {memberId} not found");

        var photo = member.Photos.FirstOrDefault(p => p.Id == photoId)
            ?? throw new NotFoundException($"Photo with ID {photoId} not found");

        if (photo.IsMain)
            throw new BadRequestException("You cannot delete your main photo");

        if (!string.IsNullOrEmpty(photo.PublicId))
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null)
                throw new BadRequestException($"Failed to delete photo from Cloudinary: {result.Error.Message}");
        }

        member.Photos.Remove(photo);
        memberRepository.Update(member);
        return await memberRepository.SaveAllAsync();
    }
}
