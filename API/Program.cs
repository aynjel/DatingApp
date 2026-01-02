using System.IO.Compression;
using System.Text;
using API.Data;
using API.Data.Repository;
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
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// SECTION 1: CORS CONFIGURATION
// ============================================
builder.Services.AddCors(options =>
{
    // Development Policy - Allow local Angular dev server
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

    // Production Policy - Specific domains only
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

// ============================================
// SECTION 2: AUTHENTICATION & AUTHORIZATION
// ============================================
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

// ============================================
// SECTION 3: LOGGING CONFIGURATION (SERILOG)
// ============================================
builder.Host.UseSerilog((context, configuration) =>
{
    if (context.HostingEnvironment.IsDevelopment())
    {
        // Development: Verbose console logging
        configuration
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
            .WriteTo.Console(
                outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"
            );
    }
    else
    {
        // Production: File logging with rotation
        configuration
            .MinimumLevel.Information()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
            .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Error)
            .MinimumLevel.Override("System", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
            .WriteTo.File(
                path: "Logs/log-.txt",
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 7,
                fileSizeLimitBytes: 10_000_000,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}] [{Level:u3}] {Message:lj}{NewLine}{Exception}"
            )
            .WriteTo.Console(
                restrictedToMinimumLevel: LogEventLevel.Error
            );
    }
});

// ============================================
// SECTION 4: CONTROLLERS & JSON SERIALIZATION
// ============================================
builder.Services.AddControllers();

// ============================================
// SECTION 5: DATABASE CONFIGURATION
// ============================================
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

// ============================================
// SECTION 6: RESPONSE COMPRESSION (PRODUCTION)
// ============================================
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

// ============================================
// SECTION 7: SWAGGER CONFIGURATION (DEV ONLY)
// ============================================
//if (builder.Environment.IsDevelopment())
//{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "DatingApp API",
            Version = "v1",
            Description = "DatingApp API endpoints - Development Environment",
            Contact = new OpenApiContact
            {
                Name = "Dating App Team",
                Url = new Uri("https://github.com/aynjel/DatingApp")
            },
            License = new OpenApiLicense
            {
                Name = "MIT License",
                Url = new Uri("https://opensource.org/licenses/MIT")
            }
        });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Description = @"JWT Authorization header using the Bearer scheme. 
                          Enter 'Bearer' [space] and then your token in the text input below.
                          Example: 'Bearer 12345abcdef'",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT"
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });

        // Enable annotations for better Swagger documentation
        c.EnableAnnotations();

        // Include XML comments if available
        var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    });
//}

// ============================================
// SECTION 8: HEALTH CHECKS
// ============================================
builder.Services.AddHealthChecks()
    .AddCheck("database", () =>
    {
        using var scope = builder.Services.BuildServiceProvider().CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        try
        {
            context.Database.CanConnect();
            return HealthCheckResult.Healthy("Database connection is healthy");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database connection failed", ex);
        }
    })
    .AddCheck("self", () => HealthCheckResult.Healthy("Application is running"));

// ============================================
// SECTION 9: APPLICATION SERVICES (DI)
// ============================================
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMemberRepository, MemberRepository>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IGenerateJWTService, GenerateJWTService>();

// ============================================
// BUILD THE APPLICATION
// ============================================
var app = builder.Build();

// ============================================
// MIDDLEWARE PIPELINE
// ============================================

// 1. EXCEPTION HANDLING
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts(); // HTTP Strict Transport Security
}

// 2. HTTPS REDIRECTION
app.UseHttpsRedirection();

// 3. STATIC FILES
// This allows serving Angular app without authentication
app.UseDefaultFiles();
app.UseStaticFiles();

// 4. ROUTING
app.UseRouting();

// 5. CORS
var corsPolicy = app.Environment.IsDevelopment() 
    ? "DevelopmentPolicy" 
    : "ProductionPolicy";
app.UseCors(corsPolicy);

// 6. AUTHENTICATION
app.UseAuthentication();

// 7. AUTHORIZATION
app.UseAuthorization();

// 8. RESPONSE COMPRESSION (PRODUCTION ONLY)
if (!app.Environment.IsDevelopment())
{
    app.UseResponseCompression();
}

// 9. CUSTOM MIDDLEWARE
app.UseMiddleware<ExceptionMiddleware>();

// ============================================
// SWAGGER UI (DEVELOPMENT ONLY)
// ============================================
//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "DatingApp API V1");
        c.RoutePrefix = "swagger";
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
    });
//}

// ============================================
// ENDPOINT MAPPINGS
// ============================================

// Root endpoint with environment-aware information
app.MapGet("/api", (HttpContext httpContext) =>
{
    var environment = app.Environment.EnvironmentName;
    
    // Dynamically determine base URL from request
    var baseUrl = app.Environment.IsDevelopment()
        ? "https://localhost:5001"
        : $"{httpContext.Request.Scheme}://{httpContext.Request.Host}";

    var response = new
    {
        Message = "Welcome to the DatingApp API",
        Version = "v1",
        Environment = environment,
        Timestamp = DateTime.UtcNow,
        Documentation = app.Environment.IsDevelopment() 
            ? $"{baseUrl}/swagger" 
            : "Swagger is disabled in production for security",
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
            IsHttps = httpContext.Request.IsHttps
        }
    };

    return Results.Json(response);
}).AllowAnonymous();

// Health check endpoint
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

// API Controllers
app.MapControllers();

// SPA Fallback
// Catches all unmatched routes and returns index.html for Angular routing
app.MapFallbackToController("Index", "Fallback");

// ============================================
// DATABASE MIGRATION & SEEDING
// ============================================
//var isSwaggerGen = args.Any(arg => arg.Contains("swagger", StringComparison.OrdinalIgnoreCase));

//if (!isSwaggerGen)
//{
//    using (var scope = app.Services.CreateScope())
//    {
//        var services = scope.ServiceProvider;
//        var logger = services.GetRequiredService<ILogger<Program>>();

//        try
//        {
//            var context = services.GetRequiredService<DataContext>();
//            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

//            logger.LogInformation("========================================");
//            logger.LogInformation("Starting Application Initialization");
//            logger.LogInformation("========================================");
//            logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);
//            logger.LogInformation("Database: {Database}",
//                connectionString?.Contains("localhost") == true ? "Local SQL Server" : "Production SQL Server");

//            // Run migrations
//            if (app.Environment.IsDevelopment())
//            {
//                logger.LogInformation("Running database migrations...");
//                await context.Database.MigrateAsync();
//                logger.LogInformation("Database migrations completed successfully");

//                // Seed data in development
//                logger.LogInformation("Seeding database...");
//                await Seed.SeedUsers(context);
//                logger.LogInformation("Database seeding completed successfully");
//            }
//            else
//            {
//                // Production: Only migrate if explicitly configured
//                var runMigrations = builder.Configuration.GetValue<bool>("RunMigrationsOnStartup", false);
//                if (runMigrations)
//                {
//                    logger.LogInformation("Running production database migrations...");
//                    await context.Database.MigrateAsync();
//                    logger.LogInformation("Production migrations completed successfully");

//                    // Seed only if database is empty
//                    var hasUsers = await context.Users.AnyAsync();
//                    if (!hasUsers)
//                    {
//                        logger.LogInformation("Database is empty. Seeding initial data...");
//                        await Seed.SeedUsers(context);
//                        logger.LogInformation("Initial data seeding completed");
//                    }
//                }
//                else
//                {
//                    logger.LogInformation("Skipping migrations (RunMigrationsOnStartup=false)");
//                }
//            }

//            logger.LogInformation("========================================");
//            logger.LogInformation("Application Initialization Complete");
//            logger.LogInformation("========================================");
//        }
//        catch (Exception ex)
//        {
//            logger.LogError(ex, "An error occurred during application initialization");

//            if (!app.Environment.IsDevelopment())
//            {
//                // In production, prevent app from starting if critical initialization fails
//                logger.LogCritical("Critical initialization failure in production. Application will not start.");
//                throw;
//            }

//            logger.LogWarning("Application will continue despite initialization errors in development environment");
//        }
//    }
//}

// ============================================
// START THE APPLICATION
// ============================================
app.Run();
