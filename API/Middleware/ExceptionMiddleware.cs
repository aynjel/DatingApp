using System.Text.Json;
using API.Exceptions;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ApiException apiEx)
        {
            logger.LogWarning(apiEx, "Handled ApiException");
            await WriteJsonResponseAsync(context, apiEx.StatusCode, apiEx.Message);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception");
            await WriteJsonResponseAsync(context, StatusCodes.Status500InternalServerError, ex.Message ?? "An unexpected error occurred.");
        }
    }

    private static async Task WriteJsonResponseAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var payload = new
        {
            title = statusCode >= 500 ? "Server Error" : "Error",
            status = statusCode,
            detail = message
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, options));
    }
}
