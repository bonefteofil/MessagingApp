using System.Text.RegularExpressions;
using backend.Models;

namespace backend.Controllers;

public static class Validations
{
    public static async Task ValidateGroupMembership(int groupId, int userId, Supabase.Client _supabase)
    {
        var response = await _supabase
            .From<SupabaseInboxGroup>()
            .Where(g => g.Id == groupId)
            .Get();

        var groups = response.Models;
        if (groups.Count == 0)
            throw new KeyNotFoundException("Group not found.");

        bool isMember = groups.Any(g => g.UserId == userId);
        if (!groups[0].Public && !isMember)
            throw new UnauthorizedAccessException("You are not a member of this group.");
    }
}
