using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repository;

public interface IMemberRepository
{
    Task AddAsync(Member member);
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<IReadOnlyList<Member>> GetMembersAsync();
    Task<PagedList<Member>> GetMembersAsync(PaginationParams paginationParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
}
