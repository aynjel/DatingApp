namespace API.Model.DTO.Response;

public class UserAccountResponseDto : UserDetailsResponseDto
{
  public string Name { get; internal set; }
  public TokenResponseDto Token { get; set; }
}
