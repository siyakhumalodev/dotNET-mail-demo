# .NET 10.0 Upgrade Plan

## Execution Steps

Execute steps below sequentially one by one in the order they are listed.

1. Validate that a .NET 10.0 SDK required for this upgrade is installed on the machine and if not, help to get it installed.
2. Ensure that the SDK version specified in global.json files is compatible with the .NET 10.0 upgrade.
3. Upgrade server\Tailwind.Mail.csproj to .NET 10.0

## Settings

This section contains settings and data used by execution steps.

### Aggregate NuGet packages modifications across all projects

NuGet packages used across all selected projects or their dependencies that need version update in projects that reference them.

| Package Name                                         | Current Version | New Version | Description                                   |
|:-----------------------------------------------------|:---------------:|:-----------:|:----------------------------------------------|
| Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore | 7.0.11          | 10.0.0      | Security vulnerability, recommended for .NET 10.0 |
| Microsoft.AspNetCore.Mvc.Testing                     | 7.0.2           | 10.0.0      | Security vulnerability, recommended for .NET 10.0 |
| Microsoft.AspNetCore.OpenApi                         | 8.0.1           | 10.0.0      | Recommended for .NET 10.0                     |
| Npgsql                                               | 8.0.1           | 10.0.0      | Security vulnerability                        |

### Project upgrade details

This section contains details about each project upgrade and modifications that need to be done in the project.

#### server\Tailwind.Mail.csproj modifications

Project properties changes:
  - Target framework should be changed from `net8.0` to `net10.0`

NuGet packages changes:
  - Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore should be updated from `7.0.11` to `10.0.0` (*security vulnerability, recommended for .NET 10.0*)
  - Microsoft.AspNetCore.Mvc.Testing should be updated from `7.0.2` to `10.0.0` (*security vulnerability, recommended for .NET 10.0*)
  - Microsoft.AspNetCore.OpenApi should be updated from `8.0.1` to `10.0.0` (*recommended for .NET 10.0*)
  - Npgsql should be updated from `8.0.1` to `10.0.0` (*security vulnerability*)

API behavioral changes:
  - System.Uri usage in `server\Services\AI.cs` (line 20) - URI length limits removed in .NET 10.0. Review the breaking change documentation.
  - System.Uri usage in `server\Program.cs` (line 17) - URI length limits removed in .NET 10.0. Review the breaking change documentation.

API source incompatibility:
  - TimeSpan.FromMinutes usage in `server\Services\BackgroundSend.cs` (line 48) - New TimeSpan.From*() overloads that take integers may cause ambiguity. Consider explicit casting if needed.