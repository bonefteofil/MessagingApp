using System.Net;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

// Configure Supabase
DotNetEnv.Env.Load();
var supabase_url = Environment.GetEnvironmentVariable("SUPABASE_URL");
var supabase_key = Environment.GetEnvironmentVariable("SUPABASE_KEY");

if (string.IsNullOrEmpty(supabase_url) || string.IsNullOrEmpty(supabase_key))
    throw new InvalidOperationException("SUPABASE environment variables are not set.");

var supabase = new Supabase.Client(supabase_url, supabase_key, new Supabase.SupabaseOptions { AutoConnectRealtime = true });
await supabase.InitializeAsync();

// Configure ASP.NET Core
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSingleton(supabase);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowCredentials",
        policy => policy
            .WithOrigins("https://bonefteofil.ro")
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader());
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = TokenService.GetValidationParameters();
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["accessToken"];
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();
app.UseRouting();
app.UseCors("AllowCredentials");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

// Override default 401 and 403 responses to return JSON body
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == (int)HttpStatusCode.Unauthorized)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"title\":\"Unauthorized: Invalid or missing token.\"}");
    }
    else if (context.Response.StatusCode == (int)HttpStatusCode.Forbidden)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"title\":\"Forbidden: You do not have access to this resource.\"}");
    }
});
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
