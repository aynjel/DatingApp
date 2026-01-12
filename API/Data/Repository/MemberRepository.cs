using API.Entities;
using API.Helpers;
using API.Interfaces.Repository;
using API.Model.DTO.Params;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MemberRepository(DataContext context) : IMemberRepository
{
    public async Task AddAsync(Member member)
    {
        context.Members.Add(member);
        await context.SaveChangesAsync();
    }

    public async Task<Member> GetMemberByIdAsync(string id)
    {
        return await context.Members
            .Include(m => m.User)
            .Include(m => m.Photos)
            .FirstOrDefaultAsync(m => m.Id == id);
    }

    public async Task<PagedList<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members
            .Include(m => m.Photos)
            .AsNoTracking()
            .AsQueryable();

        query = query.Where(m => m.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender is not null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));

        query = query.Where(m => m.DateOfBirth >= minDob && m.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(m => m.Created),
            _ => query.OrderByDescending(m => m.LastActive)
        };

        return await PagedList<Member>.CreateAsync(
            query, 
            memberParams.PageNumber, 
            memberParams.PageSize
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
