using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Newtonsoft.Json;

namespace backend.Controllers;

[ApiController]
[Route("groups/{groupId}/messages")]
public class MessagesController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessages(int groupId, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
                return Unauthorized(new { title = "Unauthorized user." });

            if (!await Validations.GroupExists(groupId, _supabase))
                return NotFound(new { title = $"Group with id {groupId} not found." });

            var messages = await _supabase
                .From<SupabaseMessageWithUsername>()
                .Select("*, username:user_id(username)")
                .Where(m => m.GroupId == groupId)
                .Order(x => x.Id, Supabase.Postgrest.Constants.Ordering.Ascending)
                .Get();

            return Ok(messages.Models.Select(x => x.ToDTO()));
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(int groupId, MessageDTO message, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
            return Unauthorized(new { title = "Unauthorized user." });

            if (message.GroupId != groupId)
                return BadRequest(new { title = $"Group ID in URL: {groupId} does not match Group ID in message: {message.GroupId}." });

            if (!await Validations.GroupExists(groupId, _supabase))
                return NotFound(new { title = $"Group with id {groupId} not found." });

            if (message.Text?.Length > 100)
                return BadRequest(new { title = "Message too long (max 100 characters)" });

            var count = await _supabase
                .From<SupabaseMessage>()
                .Where(m => m.GroupId == groupId)
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 100)
                return BadRequest(new { title = "Message limit reached (max 100 messages per group)" });

            var supabaseMessage = new SupabaseMessage
            {
                GroupId = message.GroupId,
                Text = message.Text,
                CreatedAt = DateTime.UtcNow,
                Edited = false,
                UserId = userId
            };
            var response = await _supabase.From<SupabaseMessage>().Insert(supabaseMessage);
            var createdMessage = response.Models.FirstOrDefault();
            if (createdMessage == null)
                return BadRequest();

            return Ok(createdMessage.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int groupId, int id, MessageDTO message, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (id != message.Id)
            return BadRequest(new { title = $"Message ID: {id} in URL does not match Message ID in body: {message.Id}." });

            if (message.GroupId != groupId)
                return BadRequest(new { title = $"Group ID in URL: {groupId} does not match Group ID in message: {message.GroupId}." });

            if (!await Validations.GroupExists(groupId, _supabase))
                return NotFound(new { title = $"Group with id {groupId} not found." });

            if (message.Text?.Length > 100)
                return BadRequest(new { title = "Message too long (max 100 characters)" });

            var response = await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.Id == id)
                .Get();

            var existingMessage = response.Models.FirstOrDefault();
            if (existingMessage == null)
                return NotFound();

            if (existingMessage.UserId != userId)
                return Unauthorized(new { title = "You can only edit your own messages." });

            existingMessage.Text = message.Text;
            existingMessage.Edited = true;
            await _supabase.From<SupabaseMessage>().Update(existingMessage);

            return Ok(existingMessage.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.Id == id)
                .Get();

            var deletedMessage = response.Models.FirstOrDefault();
            if (deletedMessage == null)
                return NotFound();

            if (deletedMessage.UserId != userId)
                return Unauthorized(new { title = "You can only delete your own messages." });

            await _supabase
                .From<SupabaseMessage>()
                .Delete(deletedMessage);

            return Ok(deletedMessage.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }
}