using API.Entities;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MemberRepository(DataContext context) : IMemberRepository
{
  public async Task<Member> GetMemberByIdAsync(string id)
  {
    return await context.Members.FindAsync(id);
  }

  public async Task<IReadOnlyList<Member>> GetMembersAsync()
  {
    return await context.Members.ToListAsync();
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
  {
    return await context.Photos
      .Where(p => p.MemberId == memberId)
      .ToListAsync();
  }

  public async Task<bool> SaveAllAsync()
  {
    return await context.SaveChangesAsync() > 0;
  }

  public void Update(Member member)
  {
    context.Entry(member).State = EntityState.Modified;
  }
}
