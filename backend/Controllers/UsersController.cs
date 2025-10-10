using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Newtonsoft.Json;

namespace backend.Controllers;

[ApiController]
[Route("users")]
public class UsersController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
    {
        try
        {
            var response = await _supabase
                .From<SupabaseUser>()
                .Select("*")
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }   
    }

    [HttpPost]
    public async Task<ActionResult<UserDTO>> CreateUser(UserDTO user)
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

            return Ok(createdUser.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseUser>()
                .Where(x => x.Id == id)
                .Get();

            var deletedUser = response.Models.FirstOrDefault();
            if (deletedUser == null)
                return NotFound();

            await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.UserId == id)
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
