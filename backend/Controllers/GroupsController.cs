using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Newtonsoft.Json;

namespace backend.Controllers;

[ApiController]
[Route("groups")]
public class GroupsController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDTO>>> GetGroups([FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
                return Unauthorized(new { title = "Unauthorized user." });

            var response = await _supabase
                .From<SupabaseGroupWithLastMessage>()
                .Select("*")
                .Order("last_message_sent_at", Supabase.Postgrest.Constants.Ordering.Descending)
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPost]
    public async Task<ActionResult<GroupDTO>> CreateGroup(GroupDTO group, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
                return Unauthorized(new { title = "Unauthorized user." });

            if (string.IsNullOrWhiteSpace(group.Name))
                return BadRequest(new { title = "Name is required" });

            if (group.Name!.Length > 30)
                return BadRequest(new { title = "Name too long (max 30 characters)" });

            var count = await _supabase
                .From<SupabaseGroup>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "Group limit reached (max 30 groups)" });

            var response = await _supabase
                .From<SupabaseGroup>()
                .Insert(new SupabaseGroup { Name = group.Name, CreatedAt = DateTime.UtcNow });

            var createdGroup = response.Models.FirstOrDefault();
            if (createdGroup == null)
                return BadRequest();

            return Ok(createdGroup.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(int id, GroupDTO group, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
                return Unauthorized(new { title = "Unauthorized user." });

            if (string.IsNullOrWhiteSpace(group.Name))
                return BadRequest(new { title = "Name is required" });

            if (group.Name!.Length > 30)
                return BadRequest(new { title = "Name too long (max 30 characters)" });

            if (id != group.Id)
                return BadRequest(new { title = $"Group ID: {id} in URL does not match Group ID in body: {group.Id}." });

            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == id)
                .Set(x => x.Name!, group.Name)
                .Update();
            
            var updatedGroup = response.Models.FirstOrDefault();
            if (updatedGroup == null)
                return NotFound();

            return Ok(updatedGroup.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(int id, [FromHeader(Name = "userId")] int userId)
    {
        try
        {
            if (!await Validations.ValidateUser(userId, _supabase))
                return Unauthorized(new { title = "Unauthorized user." });

            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == id)
                .Get();

            var deletedGroup = response.Models.FirstOrDefault();
            if (deletedGroup == null)
                return NotFound();

            await _supabase
                .From<SupabaseMessage>()
                .Where(x => x.GroupId == id)
                .Delete();

            await _supabase
                .From<SupabaseGroup>()
                .Delete(deletedGroup);

            return Ok(deletedGroup.ToDTO());
        }
        catch (Supabase.Postgrest.Exceptions.PostgrestException ex)
        {
            return Conflict(new { title = JsonConvert.DeserializeObject<dynamic>(ex.Message)?.message.ToString() });
        }
    }
}