namespace API.Model.DTO.Response;

public class TokenResponseDto (string accessToken, string refreshToken)
{
    public string AccessToken { get; set; } = accessToken;
    public string RefreshToken { get; set; } = refreshToken;
}
