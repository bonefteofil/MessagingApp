using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("groups/{group_id}/messages")]
public class MessagesController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    private async Task<bool> GroupExists(int group_id)
    {
        var response = await _supabase
            .From<SupabaseGroup>()
            .Where(g => g.Id == group_id)
            .Get();
        return response.Models.Count != 0;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Message>>> GetMessages(int group_id)
    {
        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });

        var messages = await _supabase
            .From<SupabaseMessage>()
            .Where(m => m.GroupId == group_id)
            .Order(x => x.Id, Supabase.Postgrest.Constants.Ordering.Ascending)
            .Get();
        return Ok(messages.Models.Select(x => x.ToMessage()));
    }

    [HttpPost]
    public async Task<ActionResult<Message>> CreateMessage(int group_id, Message message)
    {
        if (message.GroupId != group_id)
            return BadRequest(new { title = $"Group ID in URL: {group_id} does not match Group ID in message: {message.GroupId}." });

        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });

        var response = await _supabase.From<SupabaseMessage>().Insert(message.ToSupabaseMessage());
        var createdMessage = response.Models.FirstOrDefault();
        if (createdMessage == null)
            return BadRequest();

        return Ok(createdMessage.ToMessage());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int group_id, int id, Message message)
    {
        if (message.GroupId != group_id)
            return BadRequest(new { title = "Group ID in URL does not match Group ID in message." });

        if (id != message.Id)
            return BadRequest(new { title = "Invalid ID" });

        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });

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