using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Model.DTO.Params;
using API.Model.DTO.Request;
using API.Model.DTO.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class MessagesController(IMessageService messageService) : BaseController
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MessageResponseDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MessageResponseDto>> SendMessage([FromBody] CreateMessageRequestDto createMessageDto)
    {
        var result = await messageService.SendMessageAsync(createMessageDto, User.GetMemberId());
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyList<MessageResponseDto>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IReadOnlyList<MessageResponseDto>>> GetMessages([FromQuery] GetMessageParams messageParams)
    {
        var (pagination, messages) = await messageService.GetMessagesAsync(messageParams, User.GetUserId());
        Response.AddPaginationHeader(pagination);
        return Ok(messages);
    }

    [HttpGet("thread/{recipientId}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyList<MessageResponseDto>))]
    public async Task<ActionResult<IReadOnlyList<MessageResponseDto>>> GetMessageThread([FromRoute] string recipientId)
    {
        var messages = await messageService.GetMessageThreadAsync(User.GetUserId(), recipientId);
        return Ok(messages);
    }

    [HttpDelete("{messageId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult> DeleteMessage([FromRoute] string messageId)
    {
        var result = await messageService.DeleteMessageAsync(messageId, User.GetMemberId());
        return result ? Ok() : BadRequest("Failed to delete the message");
    }
}
