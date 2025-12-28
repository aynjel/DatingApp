using API.Helpers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        response.Headers.Append("Pagination", header.ToJson());
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}
