using API.Extensions;
using API.Helpers;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberService memberService, IUserService userService) : BaseController
{
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<MemberResponseDto>>> GetMembers([FromQuery] GetMembersParamsRequestDto getMembersParamsDto)
    {
        var paginationParams = new PaginationParams
        {
            PageNumber = getMembersParamsDto.PageNumber > 0 ? getMembersParamsDto.PageNumber : 1,
            PageSize = getMembersParamsDto.PageSize > 0 ? getMembersParamsDto.PageSize : 10
        };

        var pagedMembers = await memberService.GetMembersAsync(getMembersParamsDto.SearchTerm, paginationParams);
        
        Response.AddPaginationHeader(new PaginationHeader(
            pagedMembers.PageNumber,
            pagedMembers.PageSize,
            pagedMembers.TotalCount,
            pagedMembers.TotalPages
        ));

        return Ok(pagedMembers.Items);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MemberResponseDto>> GetMember([FromRoute] string id)
    {
        var member = await memberService.GetMemberByIdAsync(id);
        if (member is null) return NotFound($"Member with ID {id} not found");
        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<PhotoResponseDto>>> GetPhotosByMemberId([FromRoute] string id)
    {
        var photos = await memberService.GetPhotosByMemberIdAsync(id);
        if (photos is null || photos.Count == 0) 
            return NotFound($"No photos found for Member with ID {id}");
        return Ok(photos);
    }

    [HttpPost("{userId}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MemberResponseDto>> CreateMember(
        [FromRoute] string userId, 
        [FromBody] MemberDetailsRequestDto memberDetails)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await userService.GetByIdAsync(userId);
        if (user is null) 
            return NotFound($"User with ID {userId} not found");

        var newMember = await memberService.CreateMemberDetails(userId, memberDetails);
        return CreatedAtAction(nameof(GetMember), new { id = newMember.Id }, newMember);
    }

    [HttpPut("{userId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MemberResponseDto>> UpdateMember(
        [FromRoute] string userId, 
        [FromBody] MemberDetailsRequestDto memberDetails)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await userService.GetByIdAsync(userId);
        if (user is null) 
            return NotFound($"User with ID {userId} not found");

        var updatedMember = await memberService.UpdateMemberDetails(userId, memberDetails);
        return Ok(updatedMember);
    }
}
