using API.Entities;
using API.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberService memberService) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        var members = await memberService.GetMembersAsync();
        return Ok(members);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember([FromRoute] string id)
    {
        var member = await memberService.GetMemberByIdAsync(id);
        if (member is null)
        {
            return NotFound();
        }
        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotosByMemberId([FromRoute] string id)
    {
        var photos = await memberService.GetPhotosByMemberIdAsync(id);
        if (photos is null)
        {
            return NotFound();
        }
        return Ok(photos);
    }
}
