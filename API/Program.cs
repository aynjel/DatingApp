using System.Text;
using API.Data;
using API.Data.Repository;
using API.Model.Repository;
using API.Model.Services;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(host => true)
    );
});

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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("eqf34f3e-3f4e-4f3e-3f4e-4f3e-3f4e-4f3e")),
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IGenerateJWTService, GenerateJWTService>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DatingApp API", Version = "v1" });
});

var app = builder.Build();

app.UseDeveloperExceptionPage();
app.UseSwagger();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowAll");

app.MapControllers();

app.Run();
