using backend.Models;

namespace backend.Controllers;

public static class Validations
{
    public static async Task ValidateGroupMembership(int groupId, int userId, Supabase.Client _supabase)
    {
        var response = await _supabase
            .From<SupabaseInboxGroup>()
            .Where(g => g.Id == groupId && g.UserId == userId)
            .Get();
        if(response.Models.Count == 0)
            throw new UnauthorizedAccessException("You are not a member of this group.");
    }
}
