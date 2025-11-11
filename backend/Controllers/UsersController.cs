using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;

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
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [Authorize]
    [HttpGet("account")]
    public async Task<ActionResult<UserDTO>> GetAccountData()
    {
        try
        {
            var userId = int.Parse(TokenService.GetUserIdFromToken(Request.Cookies["accessToken"]!));
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
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }
}
