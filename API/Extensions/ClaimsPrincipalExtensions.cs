using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Gets the user ID from the ClaimsPrincipal
    /// </summary>
    public static string GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token claims");
        }
        return userId;
    }

    /// <summary>
    /// Gets the member ID from the ClaimsPrincipal (same as user ID)
    /// </summary>
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.GetUserId();
    }

    /// <summary>
    /// Gets the user's email from the ClaimsPrincipal
    /// </summary>
    public static string GetUserEmail(this ClaimsPrincipal user)
    {
        var email = user.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
        {
            throw new UnauthorizedAccessException("User email not found in token claims");
        }
        return email;
    }

    /// <summary>
    /// Gets the user's display name from the ClaimsPrincipal
    /// </summary>
    public static string GetUserDisplayName(this ClaimsPrincipal user)
    {
        var displayName = user.FindFirstValue(ClaimTypes.Name);
        if (string.IsNullOrEmpty(displayName))
        {
            throw new UnauthorizedAccessException("User display name not found in token claims");
        }
        return displayName;
    }
}
