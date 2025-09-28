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
builder.Services.AddControllers();

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

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("https://localhost:4200")
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
