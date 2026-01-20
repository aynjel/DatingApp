using API.Helpers;
using API.Model.DTO.Params;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface ILikesService
{
    Task<PagedList<MemberResponseDto>> GetMemberLikesAsync(LikesParams likesParams, string memberId);
    Task<bool> ToggleLikeAsync(string sourceMemberId, string targetMemberId);
    Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId);
}
