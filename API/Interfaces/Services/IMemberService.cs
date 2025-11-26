using API.Entities;

namespace API.Interfaces.Services;

public interface IMemberService
{
  Task<IReadOnlyList<Member>> GetMembersAsync();
  Task<Member> GetMemberByIdAsync(string id);
  Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId);
}
