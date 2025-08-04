using System.Text;
using System.Text.Json;
using API.Data;
using API.Data.Repository;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors();

// Add Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "",
            ValidAudience = "",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes("eqf34f3e-3f4e-4f3e-3f4e-4f3e-3f4e-4f3e")
            ),
        };
    });

// Add Logging
builder.Host.UseSerilog((context, configuration) =>
{
    if (context.HostingEnvironment.IsDevelopment())
    {
        configuration
            .MinimumLevel.Debug()
            .WriteTo.Console();
    }
    else
    {
        configuration
            .MinimumLevel.Information()
            .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day);
    }
});

// Add Authorization
builder.Services.AddAuthorization();

// Add Controllers
builder.Services.AddControllers();

// Add DbContext
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DatingApp API", Version = "v1" });
});

// Add Scoped Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IGenerateJWTService, GenerateJWTService>();

var app = builder.Build();

// Exception page (Development only)
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () =>
{
    if (app.Environment.IsDevelopment())
    {
        var dataAsJson = JsonSerializer.Serialize(new
        {
            Message = "Welcome to the DatingApp API",
            Version = "v1",
            Documentation = "Visit /swagger for API documentation and testing: https://localhost:5001/swagger",
            AdditionalInfo = "This is a sample API for a dating application."
        });
        return Results.Content(dataAsJson, "application/json");
    }
    return Results.Content("Welcome to the DatingApp API", "text/plain");
});

// Middleware pipeline
app.UseHttpsRedirection();

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
