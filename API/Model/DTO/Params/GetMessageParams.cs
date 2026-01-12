namespace API.Model.DTO.Params;

public class GetMessageParams : PaginationParams
{
    public string? MemberId { get; set; }
    public string Container { get; set; } = "Inbox";
}
