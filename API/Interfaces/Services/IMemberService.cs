using API.Entities;
using API.Helpers;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IMemberService
{
    Task<IReadOnlyList<MemberResponseDto>> GetMembersAsync();
    Task<PagedList<MemberResponseDto>> GetMembersAsync(PaginationParams paginationParams);
    Task<MemberResponseDto> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<PhotoResponseDto>> GetPhotosByMemberIdAsync(string memberId);
    Task<MemberResponseDto> CreateMemberDetails(string userId, MemberDetailsRequestDto memberDetails);
    Task<MemberResponseDto> UpdateMemberDetails(string userId, MemberDetailsRequestDto memberDetails);
}
