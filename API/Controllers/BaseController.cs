using API.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ServiceFilter(typeof(LogUsersActivity))]
[Route("api/[controller]")]
[ApiController]

public class BaseController : ControllerBase
{ }
