namespace API.Model.DTO.Response;

public class RefreshTokenReponseDto
{
    public required string AccessToken { get; set; }
    public required string RefreshToken { get; set; }
}
