using API.Entities;
using API.Exceptions;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Params;
using API.Model.DTO.Request;
using API.Model.DTO.Response;

namespace API.Services;

public class MessageService(IMessageRepository messageRepository, IMemberRepository memberRepository) : IMessageService
{
    public async Task<bool> DeleteMessageAsync(string messageId, string currentUserId)
    {
        var message = await messageRepository.GetMessageByIdAsync(messageId) ?? throw new NotFoundException("Message not found");
        if (message.SenderId == currentUserId)
        {
            message.IsSenderDeleted = true;
        }
        if (message.RecipientId == currentUserId)
        {
            message.IsRecipientDeleted = true;
        }
        if (message.IsSenderDeleted && message.IsRecipientDeleted)
        {
            messageRepository.Delete(message);
        }
        return await messageRepository.SaveAllAsync();
    }

    public async Task<(PaginationHeader Pagination, IReadOnlyList<MessageResponseDto> Messages)> GetMessagesAsync(GetMessageParams messageParams, string currentUserId)
    {
        var result = await messageRepository.GetMessagesForUserAsync(messageParams, currentUserId);

        var paginationHeader = new PaginationHeader(result.PageNumber, result.PageSize, result.TotalCount, result.TotalPages);

        return (paginationHeader, result.Items);
    }

    public async Task<IReadOnlyList<MessageResponseDto>> GetMessageThreadAsync(string currentUserId, string recipientId)
    {
        return await messageRepository.GetMessageThreadAsync(currentUserId, recipientId);
    }

    public async Task<MessageResponseDto> SendMessageAsync(CreateMessageRequestDto createMessageDto, string curentUserId)
    {
        var sender = await memberRepository.GetMemberByIdAsync(curentUserId);
        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient is null || sender is null || sender.Id == recipient.Id)
        {
            throw new BadRequestException("Invalid recipient");
        }

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content,
            MessageSent = DateTime.UtcNow
        };
        messageRepository.Add(message);
        var success = await messageRepository.SaveAllAsync();

        if (success) return message.ToDto();

        throw new BadRequestException("Failed to send message");
    }
}
