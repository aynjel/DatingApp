using API.Entities;
using API.Helpers;

namespace API.Interfaces.Repository;

public interface IMemberRepository
{
    Task AddAsync(Member member);
    void Update(Member member);
    Task<bool> SaveAllAsync();
    Task<PagedList<Member>> GetMembersAsync(string searchTerm, PaginationParams paginationParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
}
