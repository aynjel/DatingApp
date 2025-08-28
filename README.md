## DatingApp

Full-stack sample built with ASP.NET Core 9 (Web API) and Angular 20. It demonstrates JWT-based auth
(access/refresh tokens), a simple `User` entity with EF Core + SQLite, and a minimal UI.

### Tech stack

- **Backend**: ASP.NET Core 9, EF Core (SQLite), Serilog, JWT Bearer
- **Frontend**: Angular 20, TailwindCSS (via `@tailwindcss/postcss`), DaisyUI

## Project structure

```
Repo/
  API/                 # ASP.NET Core Web API
    Controllers/       # `AccountController`, `UsersController`
    Data/              # `DataContext`, EF Core migrations, sqlite db
    Entities/          # `User` entity
    Interfaces/        # Service & repository contracts
    Services/          # `UserService`, `GenerateJWTService`
    Model/DTO/         # Request/Response DTOs
    Program.cs         # App configuration, DI, auth, swagger
    appsettings*.json  # Config (connection string, JwtConfig)
  client/              # Angular app
    src/app            # Routes, pages, shared components, services
    package.json       # Scripts and dependencies
```

## Prerequisites

- .NET SDK 9
- Node.js 20+ and npm

## Configuration (API)

App configuration is in `API/appsettings.Development.json`:

- **ConnectionStrings:DefaultConnection**: `Data source=dating.db`
- **JwtConfig**:
  - `Key`: symmetric signing key (replace for non-dev)
  - `Issuer` and `Audience`: default `https://localhost:4200/`
  - `DurationInMinutes`: 60

The API enables CORS for origin `https://localhost:4200` and hosts Swagger in development at
`https://localhost:5001/swagger`.

Launch profile (`API/Properties/launchSettings.json`) serves the API at `https://localhost:5001`.

## Getting started

### 1) Restore and run the API

```bash
cd API
dotnet restore
dotnet ef database update
dotnet run
```

- API base URL: `https://localhost:5001`
- Swagger: `https://localhost:5001/swagger`

### 2) Install and run the Angular client

```bash
cd client
npm install
npm run start
```

- Client dev URL: `https://localhost:4200`

## Data model

`API/Entities/User.cs` contains:

- `Id`, `FirstName`, `LastName`, `Username`, `Email`
- `PasswordHash`, `PasswordSalt`
- `AccessToken`, `RefreshToken`, `RefreshTokenExpiryTime`

## Authentication

- JWT Bearer is configured in `Program.cs`. Tokens are issued by `GenerateJWTService` (registered in DI) and
  used by `UserService`.
- Access token lifetime is set via `JwtConfig:DurationInMinutes`.
- Refresh tokens are persisted on the `User` entity.
- CORS allows the Angular origin.

## API endpoints

Base route prefix is set by `BaseController` (conventional `[controller]`). Key endpoints:

### Account (`/api/account`)

- `POST /api/account/register`

  - Body: `CreateUserRequestDto` { `firstName`, `lastName`, `username`, `email`, `password` }
  - Response: `UserAccountResponseDto`

- `POST /api/account/login`

  - Body: `LoginRequestDto` { `username`, `password` }
  - Response: `TokenResponseDto` { `accessToken`, `refreshToken` }

- `POST /api/account/refresh-token` (requires Authorization)

  - Body: `RefreshTokenRequestDto` { `userId`, `refreshToken` }
  - Response: `TokenResponseDto`

- `GET /api/account/current-user` (requires Authorization)
  - Reads bearer token, returns `UserAccountResponseDto`

### Users (`/api/users`) — requires Authorization

- `GET /api/users`

  - Response: `UserDetailsResponseDto[]`

- `GET /api/users/{id}`

  - Response: `UserDetailsResponseDto`

- `GET /api/users/username/{username}`
  - Response: `UserDetailsResponseDto`

Notes:

- On bad input or not found, controllers return appropriate `400/404`. Server errors log with Serilog and
  return `500`.

## DTOs

- Requests: `CreateUserRequestDto`, `LoginRequestDto`, `RefreshTokenRequestDto`
- Responses: `UserDetailsResponseDto`, `UserAccountResponseDto`, `TokenResponseDto`

## Database and migrations

SQLite DB file lives under `API/dating.db`.

Common EF Core commands (run inside `API/`):

```bash
dotnet ef migrations add <Name>
dotnet ef database update
```

## Frontend (Angular)

- Scripts (`client/package.json`): `start`, `build`, `watch`, `test`
- Uses Angular standalone setup, routes under `src/app/app.routes.ts`, pages under `src/app/pages/*`, and
  shared services/components in `src/app/shared/*`.
- Configure environment files in `client/src/environments/` if you expose API base URLs or feature flags.

## Local development flow

1. Run API: `dotnet run` in `API/`
2. Run client: `npm run start` in `client/`
3. Register a user via Swagger or UI, then login to obtain tokens.
4. Use the access token as `Authorization: Bearer <token>` to call protected endpoints.

## Security notes

- Replace the development `JwtConfig:Key` with a secure secret in real deployments.
- Do not commit production secrets. Use environment variables or user secrets.
- Consider HTTPS certificates and proper CORS origins beyond localhost.

## Troubleshooting

- If Swagger is unreachable, confirm API is running at `https://localhost:5001` and environment is
  Development.
- If Angular cannot call the API, check CORS origin (`Program.cs`) and that both are using `https` with
  matching ports.
- If `dotnet ef` commands fail, install tools: `dotnet tool install --global dotnet-ef`.

## License

Personal project for learning and demo purposes.
