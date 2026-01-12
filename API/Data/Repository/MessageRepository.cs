using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Model.DTO.Params;
using API.Model.DTO.Response;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MessageRepository(DataContext context) : IMessageRepository
{
    public async Task AddMessageAsync(Message message)
    {
        await context.Messages.AddAsync(message);
    }

    public async Task DeleteMessageAsync(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message> GetMessageByIdAsync(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }

    public async Task<PagedList<MessageResponseDto>> GetMessagesForUserAsync(GetMessageParams messageParams)
    {
        var query = context.Messages
            .OrderByDescending(message => message.MessageSent)
            .AsQueryable();

        query = messageParams.Container.ToLower() switch
        {
            "inbox" => query.Where(m => m.RecipientId == messageParams.MemberId && !m.IsRecipientDeleted),
            "outbox" => query.Where(m => m.SenderId == messageParams.MemberId && !m.IsSenderDeleted),
            _ => query.Where(m => m.RecipientId == messageParams.MemberId && !m.IsRecipientDeleted && m.DateRead == null)
        };

        var messagesQuery = query.Select(MessageExtensions.ToDtoExpression());

        return await PagedList<MessageResponseDto>.CreateAsync(
            messagesQuery,
            messageParams.PageNumber,
            messageParams.PageSize
        );
    }

    public async Task<IReadOnlyList<MessageResponseDto>> GetMessageThreadAsync(string currentUserId, string recipientId)
    {
        await context.Messages
            .Where(message =>
                message.RecipientId == currentUserId &&
                message.DateRead == null &&
                message.SenderId == recipientId
            )
            .ExecuteUpdateAsync(
                m => m.SetProperty(x => x.DateRead, DateTime.UtcNow)
            );

        var messages = await context.Messages
            .Where(
                m =>
                    (m.RecipientId == currentUserId && !m.IsRecipientDeleted && m.SenderId == recipientId) ||
                    (m.RecipientId == recipientId && !m.IsSenderDeleted && m.SenderId == currentUserId)
            )
            .OrderBy(m => m.MessageSent)
            .Select(MessageExtensions.ToDtoExpression())
            .ToListAsync();

        return messages;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
