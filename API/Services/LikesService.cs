using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Params;
using API.Model.DTO.Response;

namespace API.Services;

public class LikesService(ILikesRepository likesRepository) : ILikesService
{
    public async Task<PagedList<MemberResponseDto>> GetMemberLikesAsync(LikesParams likesParams, string memberId)
    {
        var pagedMembers = await likesRepository.GetMemberLikesAsync(likesParams, memberId);
        var members = pagedMembers.Items.Select(m => m.ToDto()).ToList();
        
        return new PagedList<MemberResponseDto>(
            members,
            pagedMembers.TotalCount,
            pagedMembers.PageNumber,
            pagedMembers.PageSize
        );
    }

    public async Task<bool> ToggleLikeAsync(string sourceMemberId, string targetMemberId)
    {
        var existingLike = await likesRepository.GetMemberLikeAsync(sourceMemberId, targetMemberId);
        if (existingLike is null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };
            likesRepository.AddLike(like);
        } 
        else
        {
            likesRepository.DeleteLike(existingLike);
        }
        return await likesRepository.SaveAllAsync();
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId)
    {
        return await likesRepository.GetCurrentMemberLikeIdsAsync(memberId);
    }
}
