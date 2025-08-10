namespace API.Model.DTO.Response;

public class UserAccountResponseDto : UserDetailsResponseDto
{
  public string Token { get; set; }
  public DateTime Expiration { get; set; }
}
