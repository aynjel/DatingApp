using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repository;

public interface IMemberRepository
{
    Task AddAsync(Member member);
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PagedList<Member>> GetMembersAsync(MemberParams memberParams);
    Task<Member> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
}
