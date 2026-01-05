using API.Entities;
using API.Helpers;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IMemberService
{
    Task<PagedList<MemberResponseDto>> GetMembersAsync(string searchTerm, PaginationParams paginationParams);
    Task<MemberResponseDto> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<PhotoResponseDto>> GetPhotosByMemberIdAsync(string memberId);
    Task<MemberResponseDto> CreateMemberDetails(string userId, MemberDetailsRequestDto memberDetails);
    Task<MemberResponseDto> UpdateMemberDetails(string userId, MemberDetailsRequestDto memberDetails);
    Task<bool> AddPhotoAsync(string memberId, Photo photo);
    Task<IReadOnlyList<Photo>> AddPhotosAsync(string memberId, List<Photo> photos);
    Task<bool> SetMainPhotoAsync(string memberId, string photoId);
    Task<bool> DeletePhotoAsync(string memberId, string photoId);
}
