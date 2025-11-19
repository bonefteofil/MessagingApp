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
                .From<SupabaseGroupWithUsername>()
                .Select("*, username:owner_id(username)")
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
                .Order("created_at", Supabase.Postgrest.Constants.Ordering.Descending)
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

            if (group.Public && group.MembersIds.Count > 0)
                return BadRequest(new { title = "Public groups cannot have members." });

            var count = await _supabase
                .From<SupabaseGroup>()
                .Count(Supabase.Postgrest.Constants.CountType.Exact);
            if (count >= 30)
                return BadRequest(new { title = "Group limit reached (max 30 groups)" });

            // Insert group
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            var response = await _supabase
                .From<SupabaseGroup>()
                .Insert(new SupabaseGroup {
                    Name = group.Name,
                    CreatedAt = DateTime.UtcNow,
                    Public = group.Public,
                    OwnerId = userId
                });

            var createdGroup = response.Models.FirstOrDefault();
            if (createdGroup == null)
                return BadRequest();
            
            // Add members
            var newMembersIds = group.MembersIds;
            newMembersIds.Add(userId);

            for (int i = 0; i < newMembersIds.Count; i++)
            {
                var newMember = new SupabaseGroupMember {
                    GroupId = createdGroup.Id,
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

            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == groupId)
                .Get();
            
            var updatedGroup = response.Models.FirstOrDefault();
            if (updatedGroup == null)
                return NotFound();
            if (group.Public != updatedGroup.Public)
                return BadRequest(new { title = "Cannot change group visibility." });
            if (updatedGroup.Public && group.MembersIds.Count > 0)
                return BadRequest(new { title = "Public groups cannot have members." });
            
            // Validate membership
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            if (updatedGroup.OwnerId != userId)
                return BadRequest(new { title = "Only the group owner can update the group." });

            // Update group name
            updatedGroup.Name = group.Name;
            await _supabase
                .From<SupabaseGroup>()
                .Update(updatedGroup);

            if (updatedGroup.Public)
                return Ok(updatedGroup.ToDTO());

            // Update members
            var newMembersIds = group.MembersIds;
            newMembersIds.Add(userId);

            var actualMembers = await _supabase
                .From<SupabaseGroupMember>()
                .Where(x => x.GroupId == groupId)
                .Get();

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

    [HttpPost("{groupId}/transfer")]
    public async Task<IActionResult> TransferGroupOwnership(int groupId, UserDTO newOwner)
    {
        try
        {
            var response = await _supabase
                .From<SupabaseGroup>()
                .Where(x => x.Id == groupId)
                .Get();
            
            var group = response.Models.FirstOrDefault();
            if (group == null)
                return NotFound(new { title = "Group not found" });

            // Validate ownership
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            if (group.OwnerId != userId)
                return BadRequest(new { title = "Only the group owner can transfer ownership." });
            if (newOwner.Id == userId)
                return BadRequest(new { title = "You are already the owner of this group." });

            // Validate new owner
            await Validations.ValidateGroupMembership(groupId, newOwner.Id, _supabase);

            // Transfer ownership
            group.OwnerId = newOwner.Id;
            await _supabase
                .From<SupabaseGroup>()
                .Update(group);

            return Ok(group.ToDTO());
            
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
            var groupResponse = await _supabase
                .From<SupabaseGroup>()
                .Select("owner_id")
                .Where(x => x.Id == groupId)
                .Get();

            var group = groupResponse.Models.FirstOrDefault();
            if (group == null)
                return NotFound();

            // Validate membership
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            if (group.OwnerId == userId)
                return BadRequest(new { title = "Group owner cannot leave the group. Delete the group instead." });

            // Remove member
            await _supabase
                .From<SupabaseGroupMember>()
                .Where(x => x.GroupId == groupId && x.UserId == userId)
                .Delete();

            return Ok(group.ToDTO());
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

            // Validate ownership
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Jti)!);
            if (deletedGroup.OwnerId != userId)
                return BadRequest(new { title = "Only the group owner can delete the group." });

            // Delete group
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