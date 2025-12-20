namespace API.Model.DTO.Response;

public class UserAccountResponseDto
{
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public TokenResponseDto Token { get; set; }
}
