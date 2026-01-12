using API.Entities;
using API.Helpers;
using API.Model.DTO.Params;
using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IMessageRepository
{
    Task AddMessageAsync(Message message);
    Task DeleteMessageAsync(Message message);
    Task<Message> GetMessageByIdAsync(string messageId);
    Task<PagedList<MessageResponseDto>> GetMessagesForUserAsync(GetMessageParams messageParams);
    Task<IReadOnlyList<MessageResponseDto>> GetMessageThreadAsync(string currentUserId, string recipientId);
    Task<bool> SaveAllAsync();
}
