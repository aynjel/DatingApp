namespace API.Model.DTO.Response;

public class BatchPhotoUploadResponseDto
{
    public List<PhotoResponseDto> Photos { get; set; } = new();
    public int TotalUploaded { get; set; }
    public int TotalFailed { get; set; }
    public List<string> Errors { get; set; }
}
