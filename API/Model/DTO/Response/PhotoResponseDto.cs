namespace API.Model.DTO.Response;

public class PhotoResponseDto
{
    public string Id { get; set; }
    public string Url { get; set; }
    public string PublicId { get; set; }
    public string MemberId { get; set; }
    public bool IsMain { get; set; }
}
