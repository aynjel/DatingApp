using System.IO.Compression;
using System.Text;
using API.Data;
using API.Data.Repository;
using API.Helpers;
using API.Interfaces.Repository;
using API.Interfaces.Services;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentPolicy", corsBuilder =>
    {
        corsBuilder
            .WithOrigins(
                "https://localhost:4200",
                "http://localhost:4200"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    options.AddPolicy("ProductionPolicy", corsBuilder =>
    {
        corsBuilder
            .WithOrigins(
                "https://dating-app-2026-bghxdzhchngjd5f3.southeastasia-01.azurewebsites.net",
                "https://datingapplication.runasp.net"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

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
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtConfig:Key"] ?? throw new InvalidOperationException("JWT Key not configured"))
            ),
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });

builder.Services.AddAuthorization();

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services);
});

builder.Services.AddControllers();

builder.Services.AddOpenApi();

#region DATABASE CONTEXT CONFIGURATION
builder.Services.AddDbContext<DataContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        // Retry configuration based on environment
        var retryCount = builder.Environment.IsDevelopment() ? 3 : 5;
        var retryDelay = builder.Environment.IsDevelopment() 
            ? TimeSpan.FromSeconds(5) 
            : TimeSpan.FromSeconds(30);

        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: retryCount,
            maxRetryDelay: retryDelay,
            errorNumbersToAdd: null
        );

        sqlOptions.CommandTimeout(30);
    });

    // Enable sensitive data logging only in development
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});
#endregion

if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddResponseCompression(options =>
    {
        options.EnableForHttps = true;
        options.Providers.Add<BrotliCompressionProvider>();
        options.Providers.Add<GzipCompressionProvider>();
    });

    builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
    {
        options.Level = CompressionLevel.Fastest;
    });

    builder.Services.Configure<GzipCompressionProviderOptions>(options =>
    {
        options.Level = CompressionLevel.SmallestSize;
    });
}

builder.Services.AddHealthChecks()
    .AddDbContextCheck<DataContext>("database", tags: ["db"])
    .AddCheck("self", () => HealthCheckResult.Healthy("Application is running"));

#region DEPENDENCY INJECTION FOR REPOSITORIES & SERVICES
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IGenerateJWTService, GenerateJWTService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<LogUsersActivity>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
#endregion

var app = builder.Build();

// ============================================
// MIDDLEWARE PIPELINE
// ============================================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(app.Environment.IsDevelopment() ? "DevelopmentPolicy" : "ProductionPolicy");

app.UseAuthentication();
app.UseAuthorization();

if (!app.Environment.IsDevelopment())
{
    app.UseResponseCompression();
}

app.UseMiddleware<ExceptionMiddleware>();

// ============================================
// ENDPOINT MAPPING
// ============================================
#region API ROOT ENDPOINT
app.MapGet("/api", (HttpContext httpContext) =>
{
    var environment = app.Environment.EnvironmentName;
    
    var baseUrl = app.Environment.IsDevelopment()
        ? "https://localhost:5001"
        : $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";

    var description = app.Environment.IsDevelopment()
        ? "Local Database Server"
        : "Production Database Server";

    var response = new
    {
        Message = "Welcome to the DatingApp API",
        Version = "v1",
        Environment = environment,
        Timestamp = DateTime.UtcNow,
        Documentation = $"{baseUrl}/scalar/v1",
        Description = description,
        OpenApiJson = $"{baseUrl}/openapi/v1.json",
        HealthCheck = $"{baseUrl}/health",
        Endpoints = new
        {
            Auth = $"{baseUrl}/api/account",
            Users = $"{baseUrl}/api/users",
            Members = $"{baseUrl}/api/members"
        },
        Server = new
        {
            Host = httpContext.Request.Host.ToString(),
            Protocol = httpContext.Request.Scheme,
            httpContext.Request.IsHttps
        }
    };

    return Results.Json(response);
}).AllowAnonymous();
#endregion

#region HEALTH CHECK ENDPOINT
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var response = new
        {
            status = report.Status.ToString(),
            environment = app.Environment.EnvironmentName,
            checks = report.Entries.Select(x => new
            {
                name = x.Key,
                status = x.Value.Status.ToString(),
                description = x.Value.Description,
                duration = x.Value.Duration.TotalMilliseconds
            }),
            totalDuration = report.TotalDuration.TotalMilliseconds
        };
        await context.Response.WriteAsJsonAsync(response);
    }
}).AllowAnonymous();
#endregion

// API Controllers
app.MapControllers();

// OpenAPI endpoint
app.MapOpenApi();

// Scalar API Documentation UI
app.MapScalarApiReference(options =>
{
    options
        .WithTitle("DatingApp API Documentation")
        .WithTheme(ScalarTheme.Purple)
        .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
});

// Catches all unmatched routes and returns index.html for Angular routing
app.MapFallbackToController("Index", "Fallback");

#region DATABASE INITIALIZATION & SEEDING
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        var context = services.GetRequiredService<DataContext>();
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        logger.LogInformation("========================================");
        logger.LogInformation("Starting Application Initialization");
        logger.LogInformation("========================================");
        logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
        logger.LogInformation("Database: {Database}",
            connectionString?.Contains("localhost") == true ? "Local SQL Server" : "Production SQL Server");

        // Run migrations
        if (app.Environment.IsDevelopment())
        {
            logger.LogInformation("Running database migrations...");
            await context.Database.MigrateAsync();
            logger.LogInformation("Database migrations completed successfully");

            // Seed data in development
            logger.LogInformation("Seeding database...");
            await Seed.SeedUsers(context);
            logger.LogInformation("Database seeding completed successfully");
        }
        else
        {
            // Production: Only migrate if explicitly configured
            var runMigrations = builder.Configuration.GetValue<bool>("RunMigrationsOnStartup", false);
            if (runMigrations)
            {
                logger.LogInformation("Running production database migrations...");
                await context.Database.MigrateAsync();
                logger.LogInformation("Production migrations completed successfully");

                // Seed only if database is empty
                var hasUsers = await context.Users.AnyAsync();
                if (!hasUsers)
                {
                    logger.LogInformation("Database is empty. Seeding initial data...");
                    await Seed.SeedUsers(context);
                    logger.LogInformation("Initial data seeding completed");
                }
            }
            else
            {
                logger.LogInformation("Skipping migrations (RunMigrationsOnStartup=false)");
            }
        }

        logger.LogInformation("========================================");
        logger.LogInformation("Application Initialization Complete");
        logger.LogInformation("========================================");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred during application initialization");

        if (!app.Environment.IsDevelopment())
        {
            // In production, prevent app from starting if critical initialization fails
            logger.LogCritical("Critical initialization failure in production. Application will not start.");
            throw;
        }

        logger.LogWarning("Application will continue despite initialization errors in development environment");
    }
}
#endregion

// ============================================
// START THE APPLICATION
// ============================================
app.Run();
