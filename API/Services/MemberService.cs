using API.Entities;
using API.Interfaces.Repository;
using API.Interfaces.Services;

namespace API.Services;

public class MemberService(IMemberRepository memberRepository) : IMemberService
{

    public Task<Member> CreateMemberDetails(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<Member> GetMemberByIdAsync(string id)
    {
        return await memberRepository.GetMemberByIdAsync(id);
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await memberRepository.GetMembersAsync();
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
    {
        return await memberRepository.GetPhotosByMemberIdAsync(memberId);
    }
}
