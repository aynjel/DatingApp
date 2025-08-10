namespace API.Model.DTO.Response;

public class LoginDetailsResponseDto : UserDetailsResponseDto
{
  public string Token { get; set; }
  public DateTime Expiration { get; set; }
}
