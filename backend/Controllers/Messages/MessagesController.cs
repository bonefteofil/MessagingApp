using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using backend.Models;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("groups/{groupId}/messages")]
public class MessagesController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MessageDTO>>> GetGroupMessages(int groupId)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti) ?? "-1");
            await Validations.ValidateGroupMembership(groupId, userId, _supabase);
            
            var messages = await _supabase
                .From<SupabaseMessageWithUsername>()
                .Select("*, username:user_id(username)")
                .Where(m => m.GroupId == groupId)
                .Order(x => x.Id, Supabase.Postgrest.Constants.Ordering.Ascending)
                .Get();

            return Ok(messages.Models.Select(x => x.ToDTO()));
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<MessageDTO>> CreateMessage(int groupId, MessageDTO message)
    {
        try
        {
            if (message.GroupId != groupId)
                return BadRequest(new { title = $"Group ID in URL: {groupId} does not match Group ID in message: {message.GroupId}." });

            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            await Validations.ValidateGroupMembership(groupId, userId, _supabase);

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
                UserId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!)
            };

            var response = await _supabase.From<SupabaseMessage>().Insert(supabaseMessage);
            var createdMessage = response.Models.FirstOrDefault();
            if (createdMessage == null)
                return BadRequest();

            return Ok(createdMessage.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPut("{messageId}")]
    public async Task<IActionResult> UpdateMessage(int groupId, int messageId, MessageDTO message)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            await Validations.ValidateGroupMembership(groupId, userId, _supabase);

            if (message.Text?.Length > 100)
                return BadRequest(new { title = "Message too long (max 100 characters)" });

            var response = await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.Id == messageId)
                .Get();

            var actualMessage = response.Models.FirstOrDefault();
            if (actualMessage == null)
                return NotFound();

            if (actualMessage.UserId != userId)
                return Unauthorized(new { title = "You can only edit your own messages." });

            actualMessage.Text = message.Text;
            actualMessage.Edited = true;
            await _supabase
                .From<SupabaseMessage>()
                .Update(actualMessage);

            return Ok(actualMessage.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(int messageId)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.Id == messageId)
                .Get();

            var deletedMessage = response.Models.FirstOrDefault();
            if (deletedMessage == null)
                return NotFound();

            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            await Validations.ValidateGroupMembership(deletedMessage.GroupId, userId, _supabase);
            if (deletedMessage.UserId != userId)
                return Unauthorized(new { title = "You can only delete your own messages." });

            await _supabase
                .From<SupabaseMessage>()
                .Delete(deletedMessage);

            return Ok(deletedMessage.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }
}