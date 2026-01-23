using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Services;
using API.Model.DTO.Params;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class LikesController(ILikesService likesService) : BaseController
{
    [HttpPost("{targetMemberId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> ToggleLike([FromRoute] string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();
        if (sourceMemberId == targetMemberId)
            return BadRequest("You cannot like yourself.");
        if (await likesService.ToggleLikeAsync(sourceMemberId, targetMemberId))
            return Ok();
        return BadRequest("Failed to like member.");
    }

    [HttpGet("list")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        var memberId = User.GetMemberId();
        var likedMemberIds = await likesService.GetCurrentMemberLikeIdsAsync(memberId);
        return Ok(likedMemberIds);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MemberResponseDto>>> GetMemberLikes([FromQuery] LikesParams likesParams)
    {
        var memberId = User.GetMemberId();
        var pagedMembers = await likesService.GetMemberLikesAsync(likesParams, memberId);

        Response.AddPaginationHeader(new PaginationHeader(
            pagedMembers.PageNumber,
            pagedMembers.PageSize,
            pagedMembers.TotalCount,
            pagedMembers.TotalPages
        ));

        return Ok(pagedMembers.Items);
    }
}
