using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using backend.Models;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("groups")]
public class GroupsController(Supabase.Client supabase) : ControllerBase
{
    private readonly Supabase.Client _supabase = supabase;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InboxGroupDTO>>> GetInboxGroups()
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);

            var response = await _supabase
                .From<SupabaseInboxGroup>()
                .Where(x => x.UserId == userId)
                .Order("last_message_at", Supabase.Postgrest.Constants.Ordering.Descending)
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GroupDTO>> GetGroupData(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            await Validations.ValidateGroupMembership(id, userId, _supabase);

            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == id)
                .Get();

            var group = response.Models.FirstOrDefault();
            if (group == null)
                return NotFound();

            return Ok(group.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpGet("{id}/members")]
    public async Task<ActionResult<IEnumerable<GroupMemberDTO>>> GetGroupMembers(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            await Validations.ValidateGroupMembership(id, userId, _supabase);

            var response = await _supabase
                .From<SupabaseMemberWithUsername>()
                .Select("*, username:user_id(username)")
                .Where(x => x.GroupId == id)
                .Get();

            return Ok(response.Models.Select(x => x.ToDTO()));
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<GroupDTO>> CreateGroup(GroupFormDTO group)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(group.Name))
                return BadRequest(new { title = "Name is required" });

            if (group.Name!.Length > 30)
                return BadRequest(new { title = "Name too long (max 30 characters)" });

            var count = await _supabase
                .From<SupabaseGroup>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "Group limit reached (max 30 groups)" });

            // Insert group
            var response = await _supabase
                .From<SupabaseGroup>()
                .Insert(new SupabaseGroup { Name = group.Name, CreatedAt = DateTime.UtcNow });

            var createdGroup = response.Models.FirstOrDefault();
            if (createdGroup == null)
                return BadRequest();
            
            // Add members
            var groupId = createdGroup.Id;
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            var newMembersIds = group.MembersIds;
            newMembersIds.Add(userId);

            for (int i = 0; i < newMembersIds.Count; i++)
            {
                var newMember = new SupabaseGroupMember {
                    GroupId = groupId,
                    UserId = newMembersIds[i],
                    CreatedAt = DateTime.UtcNow
                };

                await _supabase
                    .From<SupabaseGroupMember>()
                    .Insert(newMember);
            }

            return Ok(createdGroup.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPut("{groupId}")]
    public async Task<IActionResult> UpdateGroup(int groupId, GroupFormDTO group)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(group.Name))
                return BadRequest(new { title = "Name is required" });

            if (group.Name!.Length > 30)
                return BadRequest(new { title = "Name too long (max 30 characters)" });

            var actualMembers = await _supabase
                .From<SupabaseGroupMember>()
                .Where(x => x.GroupId == groupId)
                .Get();

            // Validate membership
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            if (actualMembers.Models.Find(x => x.UserId == userId) == null)
                return Forbid("You are not a member of this group.");

            // Update group name
            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == groupId)
                .Set(x => x.Name!, group.Name)
                .Update();
            
            var updatedGroup = response.Models.FirstOrDefault();
            if (updatedGroup == null)
                return NotFound();

            // Update members
            var newMembersIds = group.MembersIds;
            newMembersIds.Add(userId);

            // Remove old members not in new list
            foreach (var member in actualMembers.Models)
            {
                if (!newMembersIds.Contains(member.UserId) && member.UserId != userId)
                {
                    await _supabase
                        .From<SupabaseGroupMember>()
                        .Delete(member);
                }
            }

            // Add new members not in old list
            foreach (var newMember in newMembersIds)
            {
                if (!actualMembers.Models.Any(x => x.UserId == newMember))
                {
                    var memberToAdd = new SupabaseGroupMember {
                        GroupId = groupId,
                        UserId = newMember,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _supabase
                        .From<SupabaseGroupMember>()
                        .Insert(memberToAdd);
                }
            }

            return Ok(updatedGroup.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }

    [HttpPost("{groupId}/leave")]
    public async Task<IActionResult> LeaveGroup(int groupId)
    {
        try
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);

            var response = await _supabase
                .From<SupabaseGroupMember>()
                .Where(x => x.GroupId == groupId && x.UserId == userId)
                .Get();

            var memberToDelete = response.Models.FirstOrDefault();
            if (memberToDelete == null)
                return NotFound();

            await _supabase
                .From<SupabaseGroupMember>()
                .Delete(memberToDelete);

            return Ok(new { id = groupId});
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }


    [HttpDelete("{groupId}")]
    public async Task<IActionResult> DeleteGroup(int groupId)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == groupId)
                .Get();

            var deletedGroup = response.Models.FirstOrDefault();
            if (deletedGroup == null)
                return NotFound();

            await _supabase
                .From<SupabaseGroup>()
                .Delete(deletedGroup);

            return Ok(deletedGroup.ToDTO());
        }
        catch (Exception ex)
        {
            return Conflict(new { title = ex.Message });
        }
    }
}