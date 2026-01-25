using API.Entities;
using API.Helpers;
using API.Model.DTO.Params;

namespace API.Interfaces.Repository;

public interface IMemberRepository
{
    void Add(Member member);
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PagedList<Member>> GetMembersAsync(MemberParams memberParams, string currentUserId);
    Task<Member> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
}
