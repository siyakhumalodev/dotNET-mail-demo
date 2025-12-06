
using Microsoft.OpenApi.Models;
using Tailwind.Data;
using Tailwind.Mail.Services;

// Load application configuration from environment variables and appsettings.json
var config = Viper.Config("Integration");

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<IDb, DB>();
builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
if(config.Get("SEND_WORKER") == "local"){
    builder.Services.AddHostedService<BackgroundSend>();
}

// Configure Swagger/OpenAPI documentation with metadata
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "0.0.1",
        Title = "Tailwind Traders Mail Services API",
        Description = "Transactional and bulk email sending services for Tailwind Traders.",
        Contact = new OpenApiContact
        {
            Name = "Rob Conery, Aaron Wislang, and the Tailwind Traders Team",
            Url = new Uri("https://tailwindtraders.dev")
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url = new Uri("https://opensource.org/license/mit/")
        }
    });
});


var app = builder.Build();

// Enable static file serving for accessibility enhancement files (JS/CSS)
// Required for serving swagger-accessibility.js and swagger-accessibility.css from wwwroot
app.UseStaticFiles();

app.UseSwagger();

// Configure Swagger UI with accessibility enhancements
// These enhancements ensure WCAG 2.1 Level AA compliance for API documentation
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
    
    // Accessibility: Set descriptive title for screen readers (WCAG 2.4.2 Page Titled)
    options.DocumentTitle = "Tailwind Traders Mail Services API - Accessible Documentation";
    
    // Accessibility: Add meta tags for better SEO and context
    options.HeadContent = @"
        <meta name=""description"" content=""Accessible API documentation for Tailwind Traders Mail Services"">
        <meta name=""keywords"" content=""API, Mail, Accessible, Documentation"">
    ";
    
    // Accessibility: Inject custom JavaScript for ARIA live regions and keyboard navigation
    // Provides dynamic content announcements and enhanced keyboard support (WCAG 2.1.1, 4.1.3)
    options.InjectJavascript("/swagger-accessibility.js");
    
    // Accessibility: Inject custom CSS for focus indicators and contrast (WCAG 1.4.3, 2.4.7)
    options.InjectStylesheet("/swagger-accessibility.css");
});
var conn = DB.Postgres();
Tailwind.Mail.Api.PublicRoutes.MapRoutes(app);
Tailwind.Mail.Api.Admin.BroadcastRoutes.MapRoutes(app);
Tailwind.Mail.Api.Admin.ContactRoutes.MapRoutes(app);
Tailwind.Mail.Api.Admin.BulkOperationRoutes.MapRoutes(app);

app.Run();

//this is for tests
public partial class Program { }