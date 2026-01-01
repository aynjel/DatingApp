namespace API.Model.DTO.Request;

public class GetMembersParamsRequestDto
{
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public string SearchTerm { get; set; }
}
