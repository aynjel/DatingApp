using API.Entities;
using API.Helpers;
using API.Model.DTO.Params;
using API.Model.DTO.Response;

namespace API.Interfaces.Repository;

public interface IMessageRepository
{
    void Add(Message message);
    void Delete(Message message);
    Task<Message> GetMessageByIdAsync(string messageId);
    Task<PagedList<MessageResponseDto>> GetMessagesForUserAsync(GetMessageParams messageParams, string currentUserId);
    Task<IReadOnlyList<MessageResponseDto>> GetMessageThreadAsync(string currentUserId, string recipientId);
    Task<bool> SaveAllAsync();
}
