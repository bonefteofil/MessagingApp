using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class Message
{
    public int Id { get; set; }
    public string? Text { get; set; }
}

[Table("Messages")]
public class SupabaseMessage : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("text")]
    public string? Text { get; set; }

    public static Message ToMessage(SupabaseMessage supabaseMessage)
    {
        return new Message
        {
            Id = supabaseMessage.Id,
            Text = supabaseMessage.Text
        };
    }
}
