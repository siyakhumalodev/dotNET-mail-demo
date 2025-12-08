# Welcome to Tailwind Traders Mail Service

We all need email... for better or worse. This service will send transactional emails via API or batch emails to a list, using a tag or predefined segment, like MailChimp does.

## Work In Progress

We're building things out actively... hopefully getting close to showing something soon!

---

# Repository Overview

Tailwind Traders Mail Service is a multi-component solution for sending transactional and batch emails via API or bulk operations, similar to platforms like MailChimp. The system is designed for extensibility, supporting .NET, Node.js, Go, and containerized deployments.

## Repository Structure

- **server/**: Main .NET backend (Tailwind.Mail)
  - API endpoints for public and admin operations
  - Command and data models
  - Services for background sending and outbox management
  - Configuration files (`appsettings.json`, `appsettings.Development.json`)
  - Azure deployment scripts and documentation
- **cli/**: Node.js CLI tools
  - Command-line utilities for email operations
  - CSV import support
  - Modular command and parsing logic
- **db/**: Database scripts
  - SQL schema and seed data
  - Makefile for database operations
- **jobs/**: Go-based background jobs
  - Service bus integration
  - Dockerfiles for containerization
  - Bicep templates for Azure deployment
- **deploy/**: Deployment documentation
- **docs/**: Additional documentation
- **.github/**: GitHub workflows and instructions
- **.vscode/**: Editor configuration

## Technologies Used

- **.NET 8** (C#) for backend API and services
- **Node.js** for CLI utilities
- **Go** for background jobs and service bus integration
- **Docker** and **docker-compose** for container orchestration
- **Azure Bicep** for infrastructure-as-code deployments
- **SQL** for database schema

## Getting Started

### Prerequisites

- .NET 8 SDK
- Node.js (for CLI)
- Go (for jobs)
- Docker (for containerization)
- Azure CLI (for cloud deployment)

### Build and Run

#### .NET Server

```sh
dotnet build server/Tailwind.Mail.csproj
dotnet run --project server/Tailwind.Mail.csproj
```

#### Node.js CLI

```sh
cd cli
npm install
node bin/mdmail.js
```

#### Go Jobs

```sh
cd jobs
go build
./jobs
```

#### Docker Compose

```sh
docker-compose up
```

### Database Setup

```sh
cd db
make
```

### Azure Deployment

See `server/Deployment/Azure/README.md` and `jobs/deploy/azure-container-apps/containerapp.bicep` for instructions.

## Folder Details

- **server/Api/**: API route definitions
- **server/Commands/**: Command models for bulk and contact operations
- **server/Data/**: Database access and extensions
- **server/Models/**: Data models for activities, broadcasts, contacts, emails, etc.
- **server/Services/**: Core service logic
- **cli/bin/**: Executable CLI scripts
- **cli/commands/**: CLI command definitions
- **cli/lib/**: Utility libraries
- **db/**: SQL scripts and Makefile
- **jobs/**: Go source code, Dockerfiles, and deployment scripts

## Contributing

See `.github/ISSUE_TEMPLATE/` for bug reports and contribution guidelines.

## License

Specify your license here.

## Contact

For questions or support, open an issue or contact the repository owner.