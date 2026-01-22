namespace API.Model.DTO.Params;

public class GetMessageParams : PaginationParams
{
    public string Container { get; set; } = "Inbox";
}
