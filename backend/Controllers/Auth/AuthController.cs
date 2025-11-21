using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using backend.Services;
using backend.Models;

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
            var response = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Username == login.Username)
                .Get();

            var user = response.Models.FirstOrDefault();
            if (user == null)
                return BadRequest(new { title = "Invalid username." });
            if (!BCrypt.Net.BCrypt.Verify(login.Password!, user.PasswordHash))
                return Unauthorized(new { title = "Invalid password." });

            string accessToken = TokenService.GenerateAccessToken(user.Id.ToString());
            string refreshToken = await TokenService.GenerateRefreshToken(user.Id, login.DeviceName, _supabase);

            SetAccessTokenCookie(accessToken);
            SetRefreshTokenCookie(refreshToken);
            SetUserIdCookie(user.Id);
            return Ok();
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(LoginModel newUser)
    {
        try
        {
            if (newUser.Username?.Length < 4)
                return BadRequest(new { title = "Username must have at least 4 characters" });
            if (newUser.Username!.Length > 20)
                return BadRequest(new { title = "Username must have at most 20 characters" });
            if (newUser.Password?.Length < 4)
                return BadRequest(new { title = "Password must have at least 4 characters" });
            if (newUser.Password!.Length > 20)
                return BadRequest(new { title = "Password must have at most 20 characters" });

            var count = await _supabase
                .From<SupabaseUser>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "User limit reached (max 30 users)" });

            SupabaseUser newSupabaseUser = new()
            {
                Username = newUser.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.Password!)
            };

            var response = await _supabase
                .From<SupabaseUser>()
                .Insert(newSupabaseUser);

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
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
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
            return Ok();
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message } );
        }
    }

    [Authorize]
    [HttpPost("revoke/{id}")]
    public async Task<IActionResult> RevokeToken(int id)
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);

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
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message } );
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