using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("groups")]
public class GroupsController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Group>>> GetGroups()
    {
        var response = await _supabase
            .From<SupabaseGroup>()
            .Order(x => x.Id, Supabase.Postgrest.Constants.Ordering.Ascending)
            .Get();
        return Ok(response.Models.Select(x => x.ToGroup()));
    }

    [HttpPost]
    public async Task<ActionResult<Group>> CreateGroup(Group group)
    {
        var response = await _supabase.From<SupabaseGroup>().Insert(group.ToSupabaseGroup());
        var createdGroup = response.Models.FirstOrDefault();
        if (createdGroup == null)
            return BadRequest();

        return Ok(createdGroup.ToGroup());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(int id, Group group)
    {
        if (id != group.Id)
            return BadRequest(new { title = "Invalid ID" });

        var response = await _supabase.From<SupabaseGroup>().Update(group.ToSupabaseGroup());
        var updatedGroup = response.Models.FirstOrDefault();
        if (updatedGroup == null)
            return NotFound();

        return Ok(updatedGroup.ToGroup());
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
            .From<SupabaseGroup>()
            .Where(x => x.Id == id)
            .Delete();

        return Ok(deletedGroup.ToGroup());
    }
}