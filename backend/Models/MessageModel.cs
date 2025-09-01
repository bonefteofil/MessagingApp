using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class Message
{
    public int Id { get; set; }
    public string? Text { get; set; }

    public SupabaseMessage ToSupabaseMessage()
    {
        return new SupabaseMessage
        {
            Id = this.Id,
            Text = this.Text
        };
    }
}

[Table("Messages")]
public class SupabaseMessage : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("text")]
    public string? Text { get; set; }

    public Message ToMessage()
    {
        return new Message
        {
            Id = this.Id,
            Text = this.Text
        };
    }
}
