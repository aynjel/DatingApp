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

    private readonly HashSet<string> allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

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
        var userId = User.GetUserId();

        var user = await userService.GetByIdAsync(userId);
        if (user is null) 
            return NotFound($"User with ID {userId} not found");

        var updatedMember = await memberService.UpdateMemberDetails(userId, memberDetails);
        return Ok(updatedMember);
    }

    [HttpPost("add-profile-photo")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PhotoResponseDto>> AddPhoto([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file provided");

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest("File size cannot exceed 5MB");

        // Validate file type
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(fileExtension))
            return BadRequest("Invalid file type. Only JPG, JPEG, PNG, GIF, and WEBP are allowed");

        var memberId = User.GetMemberId();

        // Check if member already has 10 photos
        var existingPhotos = await memberService.GetPhotosByMemberIdAsync(memberId);
        if (existingPhotos.Count >= 10)
            return BadRequest("Maximum of 10 photos allowed per member");

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

    [HttpPost("add-photos")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BatchPhotoUploadResponseDto>> AddPhotos([FromForm] List<IFormFile> files)
    {
        if (files == null || files.Count == 0)
            return BadRequest("No files provided");

        var memberId = User.GetMemberId();

        // Check existing photos count
        var existingPhotos = await memberService.GetPhotosByMemberIdAsync(memberId);
        var availableSlots = 10 - existingPhotos.Count;

        if (availableSlots <= 0)
            return BadRequest("Maximum of 10 photos allowed per member. Please delete some photos before uploading new ones");

        // Validate total count doesn't exceed limit
        if (files.Count > availableSlots)
            return BadRequest($"You can only upload {availableSlots} more photo(s). Maximum of 10 photos allowed per member");

        var uploadedPhotos = new List<Photo>();
        var errors = new List<string>();

        // Upload all photos to Cloudinary
        foreach (var file in files)
        {
            if (file.Length == 0)
            {
                errors.Add($"File {file.FileName} is empty");
                continue;
            }

            // Validate file size (max 5MB)
            if (file.Length > 5 * 1024 * 1024)
            {
                errors.Add($"File {file.FileName} exceeds 5MB size limit");
                continue;
            }

            // Validate file type
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
            {
                errors.Add($"File {file.FileName} has invalid type. Only JPG, JPEG, PNG, GIF, and WEBP are allowed");
                continue;
            }

            try
            {
                var result = await photoService.UploadPhotoAsync(file);
                if (result.Error != null)
                {
                    errors.Add($"Failed to upload {file.FileName}: {result.Error.Message}");
                    continue;
                }

                var photo = new Photo
                {
                    Id = Guid.NewGuid().ToString(),
                    Url = result.SecureUrl.AbsoluteUri,
                    PublicId = result.PublicId,
                    MemberId = memberId
                };

                uploadedPhotos.Add(photo);
            }
            catch (Exception ex)
            {
                errors.Add($"Error uploading {file.FileName}: {ex.Message}");
            }
        }

        // If no photos were successfully uploaded, return error
        if (uploadedPhotos.Count == 0)
            return BadRequest(new { message = "Failed to upload any photos", errors });

        // Add all photos to member
        var addedPhotos = await memberService.AddPhotosAsync(memberId, uploadedPhotos);

        // Return success with any errors
        var response = new BatchPhotoUploadResponseDto
        {
            Photos = addedPhotos.Select(p => p.ToDto()).ToList(),
            TotalUploaded = addedPhotos.Count,
            TotalFailed = errors.Count,
            Errors = errors.Count > 0 ? errors : null
        };

        return Ok(response);
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
