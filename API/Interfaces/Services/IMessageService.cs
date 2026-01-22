using API.Helpers;
using API.Model.DTO.Params;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Interfaces.Services;

public interface IMessageService
{
    Task<MessageResponseDto> SendMessageAsync(CreateMessageRequestDto createMessageDto, string curentUserId);
    Task<(PaginationHeader Pagination, IReadOnlyList<MessageResponseDto> Messages)> GetMessagesAsync(GetMessageParams messageParams, string currentUserId);
    Task<bool> DeleteMessageAsync(string messageId, string currentUserId);
    Task<IReadOnlyList<MessageResponseDto>> GetMessageThreadAsync(string currentUserId, string recipientId);
}
