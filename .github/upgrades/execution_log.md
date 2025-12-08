# .NET 10.0 Upgrade Report

## Summary

Successfully upgraded the Tailwind.Mail project from .NET 8.0 to .NET 10.0. The upgrade included updating the target framework, upgrading NuGet packages (including security vulnerability fixes), and addressing API compatibility issues.

## Project target framework modifications

| Project name                | Old Target Framework | New Target Framework | Commits                                  |
|:----------------------------|:--------------------:|:--------------------:|------------------------------------------|
| server\Tailwind.Mail.csproj | net8.0               | net10.0              | 595cd53, 731c0f5, 7e4b21b                |

## NuGet Packages

| Package Name                                         | Old Version | New Version | Description                              |
|:-----------------------------------------------------|:-----------:|:-----------:|------------------------------------------|
| Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore | 7.0.11      | 10.0.0      | Security vulnerability fix               |
| Microsoft.AspNetCore.Mvc.Testing                     | 7.0.2       | 10.0.0      | Security vulnerability fix               |
| Npgsql                                               | 8.0.1       | 10.0.0      | Security vulnerability fix               |
| Swashbuckle.AspNetCore                               | 6.5.0       | 7.2.0       | .NET 10 compatibility                    |
| Microsoft.AspNetCore.OpenApi                         | 8.0.1       | (removed)   | Incompatible with Swashbuckle in .NET 10 |

## All commits

| Commit ID | Description                                                        |
|:----------|:-------------------------------------------------------------------|
| 7e4b21b   | Upgrade Tailwind.Mail project to .NET 10.0                         |
| 731c0f5   | Upgrade Tailwind.Mail.csproj dependencies                          |
| 595cd53   | Upgrade Tailwind.Mail.csproj properties and items to match net10.0 |
| 2611ca8   | Pre-upgrade commit: saving current state before .NET 10 upgrade    |

## Code changes for .NET 10 compatibility

### Removed deprecated API usage

- Removed all `.WithOpenApi()` extension method calls from route endpoints (deprecated in .NET 10 with warning ASPDEPR002)
- Files modified:
  - `server/Api/PublicRoutes.cs` - Removed 4 WithOpenApi calls
  - `server/Api/Admin/ContactRoutes.cs` - Removed 1 WithOpenApi call  
  - `server/Api/Admin/BroadcastRoutes.cs` - Removed 3 WithOpenApi calls
  - `server/Api/Admin/BulkOperationRoutes.cs` - Removed 1 WithOpenApi call

### Package compatibility resolution

- Removed `Microsoft.AspNetCore.OpenApi` package due to incompatibility between Microsoft.OpenApi 2.0 (required by Microsoft.AspNetCore.OpenApi 10.0) and Swashbuckle.AspNetCore which requires Microsoft.OpenApi 1.x
- The application now uses Swashbuckle.AspNetCore 7.2.0 for OpenAPI/Swagger functionality

## API behavioral changes noted (for review)

The analysis identified the following behavioral changes in .NET 10 that may affect the application:

1. **URI length limits removed** - Affects `System.Uri` usage in:
   - `server/Services/AI.cs` (line 20)
   - `server/Program.cs` (line 17)
   - Review: https://github.com/dotnet/docs/blob/main/docs/core/compatibility/networking/10.0/uri-length-limits-removed.md

2. **New TimeSpan.From*() overloads** - Affects `TimeSpan.FromMinutes()` in:
   - `server/Services/BackgroundSend.cs` (line 48)
   - New integer overloads may cause ambiguity; explicit casting may be needed
   - Review: https://github.com/dotnet/docs/blob/main/docs/core/compatibility/core-libraries/9.0/timespan-from-overloads.md

## Known warnings

The following NuGet package warnings exist due to transitive dependencies:
- Azure.Identity 1.10.4 (moderate severity vulnerabilities)
- Microsoft.Identity.Client 4.56.0 (moderate and low severity vulnerabilities)
- NuGet.Packaging 6.6.1 (critical severity vulnerability)

These are transitive dependencies from Azure.AI.OpenAI beta package and may require updating that package when a stable version is available.

## Build status

✅ **Build successful** - The project compiles without errors on .NET 10.0

## Next steps

1. **Review API behavioral changes** - Review the URI and TimeSpan API changes noted above to ensure they don't negatively impact application behavior
2. **Update transitive dependency vulnerabilities** - Consider updating Azure.AI.OpenAI to a newer version (currently 1.0.0-beta.13) when available to resolve transitive dependency vulnerabilities
3. **Test the application** - Run integration and end-to-end tests to ensure all functionality works correctly with .NET 10
4. **Update Microsoft.VisualStudio.Web.CodeGeneration.Design** - Currently at 7.0.10, consider updating to 10.x version if available
5. **Review deprecated WithOpenApi usage** - Consider alternative approaches for OpenAPI documentation if needed (Swashbuckle attributes, XML documentation comments)
6. **Monitor for Swashbuckle updates** - Watch for Swashbuckle updates that support Microsoft.OpenApi 2.0 to potentially re-enable Microsoft.AspNetCore.OpenApi