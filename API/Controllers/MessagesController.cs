using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Model.DTO.Params;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MessagesController(IMessageRepository messageRepository, IMemberRepository memberRepository) : BaseController
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MessageResponseDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MessageResponseDto>> SendMessage([FromBody] CreateMessageRequestDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient is null || sender is null || sender.Id == recipient.Id)
            return BadRequest("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content,
            Sender = sender,
            Recipient = recipient
        };

        await messageRepository.AddMessageAsync(message);

        if (await messageRepository.SaveAllAsync()) return Ok(message.ToDto());

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyList<MessageResponseDto>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<MessageResponseDto>>> GetMessagesForUser([FromQuery] GetMessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();
        var messages = await messageRepository.GetMessagesForUserAsync(messageParams);
        Response.AddPaginationHeader(new PaginationHeader(
            messages.PageNumber,
            messages.PageSize,
            messages.TotalCount,
            messages.TotalPages
        ));
        return Ok(messages.Items);
    }

    [HttpGet("thread/{recipientId}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyList<MessageResponseDto>))]
    public async Task<ActionResult<IReadOnlyList<MessageResponseDto>>> GetMessageThread([FromRoute] string recipientId)
    {
        var currentUserId = User.GetMemberId();
        var messages = await messageRepository.GetMessageThreadAsync(currentUserId, recipientId);
        return Ok(messages);
    }

    [HttpDelete("{messageId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteMessage([FromRoute] string messageId)
    {
        var currentUserId = User.GetMemberId();
        var message = await messageRepository.GetMessageByIdAsync(messageId);
        if (message is null)
            return NotFound("Message not found");
        if (message.SenderId != currentUserId && message.RecipientId != currentUserId)
            return BadRequest("You are not authorized to delete this message");
        if (message.SenderId == currentUserId) message.IsSenderDeleted = true;
        if (message.RecipientId == currentUserId) message.IsRecipientDeleted = true;
        if (message.IsSenderDeleted && message.IsRecipientDeleted)
            await messageRepository.DeleteMessageAsync(message);
        if (await messageRepository.SaveAllAsync()) return Ok();
        return BadRequest("Failed to delete the message");
    }
}
