using System.Text;
using System.Text.Json;
using API.Data;
using API.Data.Repository;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtConfig:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtConfig:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"])),
            ValidateIssuerSigningKey = true,
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
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// Add DbContext
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DatingApp API", Version = "v1", Description = "DatingApp API endpoints" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header,
            },
            new List<string>()
          }
        });
});

// Add Scoped Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMemberRepository, MemberRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IGenerateJWTService, GenerateJWTService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DatingApp API V1");
    c.RoutePrefix = "swagger";
});

// Root endpoint with environment-aware URLs
app.MapGet("/api", () =>
{
    var environment = app.Environment.EnvironmentName;
    var baseUrl = app.Environment.IsDevelopment() 
        ? "http://localhost:5001" 
        : "http://datingapp-001-site1.anytempurl.com";
    
    var dataAsJson = JsonSerializer.Serialize(new
    {
        Message = "Welcome to the DatingApp API",
        Version = "v1",
        Environment = environment,
        Documentation = $"Visit /swagger for API documentation: {baseUrl}/swagger",
        AdditionalInfo = "This is a sample API for a dating application.",
        DatabaseConnection = app.Environment.IsDevelopment() ? "Local SQL Server" : "Production SQL Server"
    });
    return Results.Content(dataAsJson, "application/json");
});

// Middleware pipeline
// Temporarily disable HTTPS redirection for testing on production
//if (!app.Environment.IsDevelopment())
//{
//    app.UseHttpsRedirection();
//}

app.UseMiddleware<ExceptionMiddleware>();

// Environment-aware CORS configuration
var allowedOrigins = app.Environment.IsDevelopment()
    ? new[] { "https://localhost:4200", "http://localhost:4200" }
    : new[] {
        "https://aynjel.github.io/DatingApp",
        "https://localhost:4200" // Keep for local testing against prod
    };

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins(allowedOrigins)
    .AllowCredentials()
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database migration and seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    
    try
    {
        var context = services.GetRequiredService<DataContext>();
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        
        logger.LogInformation("Starting database migration...");
        logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
        logger.LogInformation("Using connection: {Server}", 
            connectionString.Contains("localhost") ? "Local SQL Server" : "Production SQL Server");
        
        await context.Database.MigrateAsync();
        logger.LogInformation("Database migration completed successfully");
        
        await Seed.SeedUsers(context);
        logger.LogInformation("Database seeding completed successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during migration or seeding");
        throw; // Re-throw to prevent app from starting with database issues
    }
}

app.Run();
