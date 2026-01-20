using API.Extensions;
using API.Interfaces.Repository;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogUsersActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();
        if (context.HttpContext.User.Identity?.IsAuthenticated is not true) return;
        var userId = resultContext.HttpContext.User.GetUserId();
        var userRepository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
        if (userRepository is not null)
        {
            var user = await userRepository.GetByIdAsync(userId);
            if (user is not null && user.Member is not null)
            {
                user.Member.LastActive = DateTime.UtcNow;
                userRepository.Update(user);
                await userRepository.SaveAllAsync();
            }
        }
    }
}
