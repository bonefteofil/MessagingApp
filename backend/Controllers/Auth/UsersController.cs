using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using backend.Models;

namespace backend.Controllers;

[Authorize]
[ApiController]
public class UsersController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
    {
        try
        {
            var response = await _supabase
                .From<SupabaseUser>()
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpGet("account")]
    public async Task<ActionResult<UserDTO>> GetAccountData()
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            var userResponse = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Id == userId)
                .Get();

            var refreshTokensResponse = await _supabase
                .From<SupabaseRefreshToken>()
                .Where(x => x.UserId == userId)
                .Order(x => x.CreatedAt, Supabase.Postgrest.Constants.Ordering.Descending)
                .Get();

            var user = userResponse.Models.FirstOrDefault();
            if (user == null)
                return NotFound(new { title = "User not found." });
            if (refreshTokensResponse.Models.Count == 0)
                return NotFound(new { title = "No refresh tokens found for user." });

            return Ok(new
            {
                User = user.ToDTO(),
                Sessions = refreshTokensResponse.Models.Select(x => x.ToDTO()).ToList()
            });
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpDelete("account")]
    public async Task<IActionResult> DeleteAccount()
    {
        try
        {
            int userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.OwnerId == userId)
                .Get();

            if (response.Models.FirstOrDefault() != null)
                return BadRequest(new { title = "You must transfer ownership of your groups before deleting your account." });

            await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Id == userId)
                .Delete();

            Response.Cookies.Delete("accessToken");
            Response.Cookies.Delete("refreshToken");
            Response.Cookies.Delete("userId");

            return Ok(new { title = "Account deleted successfully." });
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }
}
