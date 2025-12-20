using API.Entities;
using API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberService memberService) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        var members = await memberService.GetMembersAsync();
        return Ok(members);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Member>> GetMember([FromRoute] string id)
    {
        var member = await memberService.GetMemberByIdAsync(id);
        if (member is null) return NotFound($"Member with ID {id} not found");
        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosByMemberId([FromRoute] string id)
    {
        var photos = await memberService.GetPhotosByMemberIdAsync(id);
        if (photos is null) return NotFound($"No photos found for Member with ID {id}");
        return Ok(photos);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Member>> CreateMember()
    {
        var newMember = await memberService.CreateMemberDetails("123");
        return Ok(newMember);
    }
}
