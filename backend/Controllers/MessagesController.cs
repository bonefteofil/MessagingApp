using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class MessagesController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> Get()
    {
        var response = await _supabase.From<SupabaseMessage>().Get();
        return Ok(response.Models.Select(SupabaseMessage.ToMessage));
    }
}