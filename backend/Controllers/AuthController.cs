using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginModel login)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(login.Username))
                return BadRequest(new { title = "Username is required" });
            if (string.IsNullOrWhiteSpace(login.DeviceName))
                return BadRequest(new { title = "Device name is required" });

            var response = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Username == login.Username)
                .Get();

            var user = response.Models.FirstOrDefault();
            if (user == null)
                return BadRequest(new { title = "Invalid username or password." });

            string accessToken = TokenService.GenerateAccessToken(user.Id.ToString());
            string refreshToken = await TokenService.GenerateRefreshToken(user.Id, login.DeviceName, _supabase);

            SetAccessTokenCookie(accessToken);
            SetRefreshTokenCookie(refreshToken);
            SetUserIdCookie(user.Id);
            return Ok();
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(LoginModel newUser)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(newUser.Username))
                return BadRequest(new { title = "Username is required" });

            if (newUser.Username!.Length > 20)
                return BadRequest(new { title = "Username too long (max 20 characters)" });

            if (string.IsNullOrWhiteSpace(newUser.DeviceName))
                return BadRequest(new { title = "Device name is required" });

            var count = await _supabase
                .From<SupabaseUser>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "User limit reached (max 30 users)" });

            var response = await _supabase
                .From<SupabaseUser>()
                .Insert(new SupabaseUser { Username = newUser.Username });

            var createdUser = response.Models.FirstOrDefault();
            if (createdUser == null)
                return BadRequest();

            string accessToken = TokenService.GenerateAccessToken(createdUser.Id.ToString());
            string refreshToken = await TokenService.GenerateRefreshToken(createdUser.Id, newUser.DeviceName, _supabase);
            SetAccessTokenCookie(accessToken);
            SetRefreshTokenCookie(refreshToken);
            SetUserIdCookie(createdUser.Id);
            return Ok();
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        string refreshTokenHash = Request.Cookies["refreshToken"] ?? string.Empty;
        Response.Cookies.Delete("accessToken");
        Response.Cookies.Delete("refreshToken");
        Response.Cookies.Delete("userId");

        if (!string.IsNullOrWhiteSpace(refreshTokenHash))
            await TokenService.RevokeToken(refreshTokenHash, _supabase);

        return Ok();
    }

    [Authorize]
    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        try
        {
            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");

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
                .From<SupabaseRefreshToken>()
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

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            string refreshToken = Request.Cookies["refreshToken"]!;
            if (string.IsNullOrWhiteSpace(refreshToken))
                return Unauthorized(new { title = "Refresh token is missing" });

            string newAccessToken = await TokenService.RegenerateToken(refreshToken, _supabase);
            if (string.IsNullOrWhiteSpace(newAccessToken))
                return Unauthorized(new { title = "Invalid refresh token" });

            SetAccessTokenCookie(newAccessToken);
            SetUserIdCookie(int.Parse(TokenService.GetUserIdFromToken(newAccessToken)));
            return Ok();
        }
        catch (Exception ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() } );
        }
    }

    [Authorize]
    [HttpPost("revoke/{id}")]
    public async Task<IActionResult> RevokeToken(int id)
    {
        try
        {
            int userId = int.Parse(TokenService.GetUserIdFromToken(Request.Cookies["accessToken"]!));

            var response = await _supabase
                .From<SupabaseRefreshToken>()
                .Where(x => x.Id == id)
                .Get();

            var token = response.Models.FirstOrDefault();
            if (token == null)
                return NotFound(new { title = "Refresh token not found" });
            if (token.UserId != userId)
                return Forbid();

            token.Revoked = true;
            await _supabase
                .From<SupabaseRefreshToken>()
                .Update(token);

            return Ok();
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    private void SetAccessTokenCookie(string accessToken)
    {
        Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(10)
        });
    }

    private void SetRefreshTokenCookie(string refreshToken)
    {
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });
    }

    private void SetUserIdCookie(int userId)
    {
        Response.Cookies.Append("userId", userId.ToString(), new CookieOptions
        {
            HttpOnly = false,
            Secure = true,
            Path = "/",
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7)
        });
    }
}