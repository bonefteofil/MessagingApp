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
    public async Task<ActionResult<UserDTO>> Login(LoginModel login)
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

            string accessToken = TokenService.GenerateAccessToken(user.Id.ToString(), user.Username!);

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

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(UserDTO user)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(user.Username))
                return BadRequest(new { title = "Username is required" });

            if (user.Username!.Length > 20)
                return BadRequest(new { title = "Username too long (max 20 characters)" });

            var count = await _supabase
                .From<SupabaseUser>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "User limit reached (max 30 users)" });

            var response = await _supabase
                .From<SupabaseUser>()
                .Insert(new SupabaseUser { Username = user.Username });

            var createdUser = response.Models.FirstOrDefault();
            if (createdUser == null)
                return BadRequest();

            string accessToken = TokenService.GenerateAccessToken(createdUser.Id.ToString(), user.Username);
            
            Response.Cookies.Append("accessToken", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                Path = "/",
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddMinutes(10)
            });

            return Ok(createdUser.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("accessToken");
        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        try
        {
            int userId = int.Parse(TokenService.GetUserIdFromToken(Request.Cookies["accessToken"]!));
            var response = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Id == userId)
                .Get();

            var deletedUser = response.Models.FirstOrDefault();
            if (deletedUser == null)
                return NotFound();

            await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.UserId == userId)
                .Delete();

            await _supabase
                .From<SupabaseUser>()
                .Delete(deletedUser);

            return Ok(deletedUser.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }
}