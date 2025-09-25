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
            .From<SupabaseGroupWithLastMessage>()
            .Where(g => g.Id == group_id)
            .Get();
            
        return response.Models.Count != 0;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages(int group_id)
    {
        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });

        var messages = await _supabase
            .From<SupabaseMessage>()
            .Where(m => m.GroupId == group_id)
            .Order(x => x.Id, Supabase.Postgrest.Constants.Ordering.Ascending)
            .Get();
        
        return Ok(messages.Models.Select(x => x.ToDTO()));
    }

    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(int group_id, MessageDTO message)
    {
        if (message.GroupId != group_id)
            return BadRequest(new { title = $"Group ID in URL: {group_id} does not match Group ID in message: {message.GroupId}." });

        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });
        
        if (message.Text?.Length > 100)
            return BadRequest(new { title = "Message too long (max 100 characters)" });
        
        var count = await _supabase
            .From<SupabaseMessage>()
            .Where(m => m.GroupId == group_id)
            .Count(Supabase.Postgrest.Constants.CountType.Exact);
        if (count >= 100)
            return BadRequest(new { title = "Message limit reached (max 100 messages per group)" });

        var supabaseMessage = new SupabaseMessage
        {
            GroupId = message.GroupId,
            Text = message.Text,
            CreatedAt = DateTime.UtcNow,
            Edited = false,
        };
        var response = await _supabase.From<SupabaseMessage>().Insert(supabaseMessage);
        var createdMessage = response.Models.FirstOrDefault();
        if (createdMessage == null)
            return BadRequest();

        return Ok(createdMessage.ToDTO());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int group_id, int id, MessageDTO message)
    {
        if (message.GroupId != group_id)
            return BadRequest(new { title = $"Group ID in URL: {group_id} does not match Group ID in message: {message.GroupId}." });

        if (id != message.Id)
            return BadRequest(new { title = $"Message ID: {id} in URL does not match Message ID in body: {message.Id}." });

        if (!await GroupExists(group_id))
            return NotFound(new { title = $"Group with id {group_id} not found." });

        if (message.Text?.Length > 100)
            return BadRequest(new { title = "Message too long (max 100 characters)" });

        var response = await _supabase
            .From<SupabaseMessage>()
            .Where(x => x.Id == id)
            .Set(x => x.Text!, message.Text)
            .Set(x => x.Edited, true)
            .Update();
            
        var updatedMessage = response.Models.FirstOrDefault();
        if (updatedMessage == null)
            return NotFound();

        return Ok(updatedMessage.ToDTO());
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

        return Ok(deletedMessage.ToDTO());
    }
}