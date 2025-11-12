using System.Net;
using System.Threading.RateLimiting;
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
builder.Services.AddRateLimiter(options =>
{
    var requests = Environment.GetEnvironmentVariable("RATE_LIMIT_REQUESTS");
    var interval = Environment.GetEnvironmentVariable("RATE_LIMIT_INTERVAL");
    if (string.IsNullOrEmpty(requests) || string.IsNullOrEmpty(interval))
        throw new InvalidOperationException("RATE_LIMIT environment variables are not set.");

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(_ =>
        RateLimitPartition.GetFixedWindowLimiter("global", _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = int.Parse(requests!),
            Window = TimeSpan.FromSeconds(int.Parse(interval!)),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        }));
    options.RejectionStatusCode = 429;
});

var app = builder.Build();
app.UseRouting();
app.UseCors("AllowCredentials");
app.UseRateLimiter();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
