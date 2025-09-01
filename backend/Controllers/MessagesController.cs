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
        return Ok(response.Models.Select(x => x.ToMessage()));
    }

    [HttpPost]
    public async Task<ActionResult<Message>> Create(Message message)
    {
        var response = await _supabase.From<SupabaseMessage>().Insert(message.ToSupabaseMessage());
        var createdMessage = response.Models.FirstOrDefault();
        if (createdMessage == null)
            return BadRequest();

        return Ok(createdMessage.ToMessage());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int id, Message message)
    {
        if (id != message.Id)
            return BadRequest(new { title = "Invalid ID" });

        var response = await _supabase.From<SupabaseMessage>().Update(message.ToSupabaseMessage());
        var updatedMessage = response.Models.FirstOrDefault();
        if (updatedMessage == null)
            return NotFound();

        return Ok(updatedMessage.ToMessage());
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var response = await _supabase
            .From<SupabaseMessage>()
            .Where(x => x.Id == id)
            .Get();
        var deletedMessage = response.Models.FirstOrDefault();
        if (deletedMessage == null)
            return NotFound();

        await _supabase
            .From<SupabaseMessage>()
            .Where(x => x.Id == id)
            .Delete();

        return Ok(deletedMessage.ToMessage());
    }
}