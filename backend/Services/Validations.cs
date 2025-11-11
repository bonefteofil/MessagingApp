using backend.Models;

namespace backend.Controllers;

public static class Validations
{
    public static async Task<bool> GroupExists(int groupId, Supabase.Client _supabase)
    {
        var response = await _supabase
            .From<SupabaseGroupWithLastMessage>()
            .Where(g => g.Id == groupId)
            .Get();
        return response.Models.Count != 0;
    }
}
