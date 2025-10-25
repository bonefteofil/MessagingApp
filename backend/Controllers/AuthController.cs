using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using backend.Services;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> LoginUser(LoginModel login)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Username == login.Username)
                .Get();

            var user = response.Models.FirstOrDefault();
            if (user == null)
                return BadRequest(new { title = "Invalid username or password." });

            string accessToken = TokenService.GenerateAccessToken(user.Id.ToString(), user.Username ?? "");

            Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Path = "/",
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });
            return Ok(user.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }
}