using API.Entities;
using API.Helpers;
using API.Interfaces.Repository;
using API.Model.DTO.Params;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class LikesRepository(DataContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIdsAsync(string memberId)
    {
        return await context.Likes
            .AsNoTracking()
            .Where(l => l.SourceMemberId == memberId)
            .Select(l => l.TargetMemberId)
            .ToListAsync();
    }

    public async Task<MemberLike> GetMemberLikeAsync(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PagedList<Member>> GetMemberLikesAsync(LikesParams likesParams, string memberId)
    {
        IQueryable<Member> membersQuery;

        if (likesParams.Predicate.Equals("liked", StringComparison.OrdinalIgnoreCase))
        {
            // Get members that the current user has liked
            membersQuery = context.Likes
                .Where(like => like.SourceMemberId == memberId)
                .Select(like => like.TargetMember);
        }
        else if (likesParams.Predicate.Equals("likedby", StringComparison.OrdinalIgnoreCase))
        {
            // Get members who have liked the current user
            membersQuery = context.Likes
                .Where(like => like.TargetMemberId == memberId)
                .Select(like => like.SourceMember);
        }
        else if (likesParams.Predicate.Equals("mutual", StringComparison.OrdinalIgnoreCase))
        {
            // Get mutual likes - members who liked current user AND current user liked them back
            var likedByCurrentUser = context.Likes
                .Where(l => l.SourceMemberId == memberId)
                .Select(l => l.TargetMemberId);

            membersQuery = context.Likes
                .Where(l => l.TargetMemberId == memberId && likedByCurrentUser.Contains(l.SourceMemberId))
                .Select(l => l.SourceMember);
        }
        else
        {
            // Default to "liked" if predicate is invalid
            membersQuery = context.Likes
                .Where(like => like.SourceMemberId == memberId)
                .Select(like => like.TargetMember);
        }

        // Include photos for each member
        membersQuery = membersQuery
            .Include(m => m.Photos)
            .AsNoTracking();

        return await PagedList<Member>.CreateAsync(
            membersQuery,
            likesParams.PageNumber,
            likesParams.PageSize
        );
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
