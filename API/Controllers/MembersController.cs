using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Services;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberService memberService, IUserService userService, IPhotoService photoService) : BaseController
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

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MemberResponseDto>> CreateMember([FromBody] MemberDetailsRequestDto memberDetails)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.GetUserId();

        var user = await userService.GetByIdAsync(userId);
        if (user is null) 
            return NotFound($"User with ID {userId} not found");

        var newMember = await memberService.CreateMemberDetails(userId, memberDetails);
        return CreatedAtAction(nameof(GetMember), new { id = newMember.Id }, newMember);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MemberResponseDto>> UpdateMember([FromBody] MemberDetailsRequestDto memberDetails)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.GetUserId();

        var user = await userService.GetByIdAsync(userId);
        if (user is null) 
            return NotFound($"User with ID {userId} not found");

        var updatedMember = await memberService.UpdateMemberDetails(userId, memberDetails);
        return Ok(updatedMember);
    }

    [HttpPost("add-photo")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> AddPhoto([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        // Get current member ID from JWT token
        var memberId = User.GetMemberId();

        // Upload photo to Cloudinary
        var result = await photoService.UploadPhotoAsync(file);
        if (result.Error != null) 
            return BadRequest(result.Error.Message);

        // Create photo entity
        var photo = new Photo
        {
            Id = Guid.NewGuid().ToString(),
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            MemberId = memberId
        };

        var success = await memberService.AddPhotoAsync(memberId, photo);

        if (!success)
            return BadRequest("Failed to add photo");

        return NoContent();
    }

    [HttpPut("set-main-photo/{photoId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> SetMainPhoto([FromRoute] string photoId)
    {
        var memberId = User.GetMemberId();
        var success = await memberService.SetMainPhotoAsync(memberId, photoId);
        
        if (!success)
            return BadRequest("Failed to set main photo");

        return NoContent();
    }

    [HttpDelete("delete-photo/{photoId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeletePhoto([FromRoute] string photoId)
    {
        var memberId = User.GetMemberId();
        var success = await memberService.DeletePhotoAsync(memberId, photoId);
        
        if (!success)
            return BadRequest("Failed to delete photo");

        return NoContent();
    }
}
