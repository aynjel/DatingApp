using API.Entities;
using API.Helpers;
using API.Model.DTO.Params;

namespace API.Interfaces.Repository;

public interface ILikesRepository
{
    Task<MemberLike> GetMemberLikeAsync(string sourceMemberId, string targetMemberId);
    Task<PagedList<Member>> GetMemberLikesAsync(LikesParams likesParams, string memberId);
    Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId);
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);
    Task<bool> SaveAllAsync();
}
