//public endpoints for subscribe/unsubscribe
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Tailwind.Data;
using Tailwind.Mail.Commands;
using Tailwind.Mail.Models;

namespace Tailwind.Mail.Api;

public class PublicRoutes{

  public static void MapRoutes(IEndpointRouteBuilder app)
  {

    //public routes
    app.MapGet("/about", () => "Tailwind Traders Mail Services API");

    app.MapGet("/unsubscribe/{key}", (string key, [FromServices] IDb db) => {
      using(var conn = db.Connect()){
        var cmd = new ContactOptOutCommand(key);
        var result = cmd.Execute(conn);
        return result.Updated > 0;
      }
    });

    //this isn't implemented yet in terms of data
    app.MapGet("/link/clicked/{key}", (string key, [FromServices] IDb db) => {
      var cmd = new LinkClickedCommand(key);
      var result = cmd.Execute();
      return result;
    });

    app.MapPost("/signup", async ([FromBody] SignUpRequest req,  [FromServices] IDb db) => {
      var contact = new Contact{
        Email = req.Email,
        Name = req.Name
      };
      using var conn = db.Connect();
      var result = await conn.ExecuteAsync("insert into contacts (email, name) values (@Email, @Name)", contact);
      return result;
      
    });
  }

}