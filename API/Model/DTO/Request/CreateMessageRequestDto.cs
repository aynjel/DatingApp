namespace API.Model.DTO.Request;

public class CreateMessageRequestDto
{
    public string RecipientId { get; set; }
    public required string Content { get; set; }
}
