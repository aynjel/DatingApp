using API.Entities;
using API.Helpers;
using API.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MemberRepository(DataContext context) : IMemberRepository
{

  public async Task AddAsync(Member member)
  {
    context.Members.Add(member);
    await context.SaveChangesAsync();
  }

  public async Task<Member?> GetMemberByIdAsync(string id)
  {
    return await context.Members
      .Include(m => m.Photos)
      .FirstOrDefaultAsync(m => m.Id == id);
  }

  public async Task<IReadOnlyList<Member>> GetMembersAsync()
  {
    return await context.Members
      .Include(m => m.Photos)
      .AsNoTracking()
      .ToListAsync();
  }

  public async Task<PagedList<Member>> GetMembersAsync(PaginationParams paginationParams)
  {
    var query = context.Members
      .Include(m => m.Photos)
      .AsNoTracking()
      .OrderByDescending(m => m.Created)
      .AsQueryable();

    return await PagedList<Member>.CreateAsync(
      query, 
      paginationParams.PageNumber, 
      paginationParams.PageSize
    );
  }

  public async Task<IReadOnlyList<Photo>> GetPhotosByMemberIdAsync(string memberId)
  {
    return await context.Members
      .Where(p => p.Id == memberId)
      .SelectMany(p => p.Photos)
      .AsNoTracking()
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
