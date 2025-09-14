using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("groups")]
public class GroupsController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupDTO>>> GetGroups()
    {
        var response = await _supabase
            .From<SupabaseGroupWithLastMessage>()
            .Select("*")
            .Order("last_message_sent_at", Supabase.Postgrest.Constants.Ordering.Descending)
            .Get();

        return Ok(response.Models.Select(x => x.ToDTO()));
    }

    [HttpPost]
    public async Task<ActionResult<GroupDTO>> CreateGroup(GroupDTO group)
    {
        if (string.IsNullOrWhiteSpace(group.Name))
            return BadRequest(new { title = "Name is required" });

        var response = await _supabase
            .From<SupabaseGroup>()
            .Insert(new SupabaseGroup{Name = group.Name, CreatedAt = DateTime.UtcNow});
        
        var createdGroup = response.Models.FirstOrDefault();
        if (createdGroup == null)
            return BadRequest();

        return Ok(createdGroup.ToDTO());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(int id, GroupDTO group)
    {
        if (id != group.Id)
            return BadRequest(new { title = $"Group ID: {id} in URL does not match Group ID in body: {group.Id}." });

        if (string.IsNullOrWhiteSpace(group.Name))
            return BadRequest(new { title = "Name is required" });

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(int id)
    {
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
            .Where(x => x.Id == id)
            .Delete();

        return Ok(deletedGroup.ToDTO());
    }
}