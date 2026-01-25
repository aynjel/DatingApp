using API.Entities;
using API.Model.DTO.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AdminController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager) : BaseController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = userManager.Users.ToList();
        var usersWithRoles = new List<object>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            usersWithRoles.Add(new
            {
                user.Id,
                user.DisplayName,
                user.Email,
                Roles = roles.ToList(),
            });
        }

        return Ok(usersWithRoles);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult> EditRoles([FromBody] EditRolesRequestDto request)
    {
        var user = await userManager.FindByIdAsync(request.UserId);
        if (user is null)
            return NotFound(new { message = "User not found" });

        // Validate that all requested roles exist
        foreach (var roleName in request.Roles)
        {
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
                return BadRequest(new { message = $"Role '{roleName}' does not exist" });
        }

        // Get current roles
        var currentRoles = await userManager.GetRolesAsync(user);

        // Remove all current roles
        var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { message = "Failed to remove current roles", errors = removeResult.Errors });

        // Add new roles
        var addResult = await userManager.AddToRolesAsync(user, request.Roles);
        if (!addResult.Succeeded)
            return BadRequest(new { message = "Failed to add new roles", errors = addResult.Errors });

        var updatedRoles = await userManager.GetRolesAsync(user);
        
        return Ok(new
        {
            message = "Roles updated successfully",
            userId = user.Id,
            userName = user.UserName,
            roles = updatedRoles
        });
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public async Task<ActionResult> GetPhotosForModeration()
    {
        return Ok("This is a moderator endpoint that returns photos to moderate.");
    }
}
