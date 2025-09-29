using backend.Models;

namespace backend.Controllers;

public static class Validations
{
    public static async Task<bool> ValidateUser(int userId, Supabase.Client _supabase)
    {
        var response = await _supabase
            .From<SupabaseUser>()
            .Where(u => u.Id == userId)
            .Get();
        return response.Models.Count != 0;
    }

    public static async Task<bool> GroupExists(int groupId, Supabase.Client _supabase)
    {
        var response = await _supabase
            .From<SupabaseGroupWithLastMessage>()
            .Where(g => g.Id == groupId)
            .Get();
        return response.Models.Count != 0;
    }
}
