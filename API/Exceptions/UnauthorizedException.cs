namespace API.Exceptions;

public class UnauthorizedException(string message) : ApiException(message, 401)
{
}