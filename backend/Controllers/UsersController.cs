using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using backend.Models;

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
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }   
    }
}
