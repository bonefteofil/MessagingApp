using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class Message
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public int GroupId { get; set; }
    public DateTime? CreatedAt { get; set; }

    public SupabaseMessage ToSupabaseMessage()
    {
        return new SupabaseMessage
        {
            Id = this.Id,
            Text = this.Text,
            GroupId = this.GroupId,
            CreatedAt = this.CreatedAt
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
    [Column("group_id")]
    public int GroupId { get; set; }
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    public Message ToMessage()
    {
        return new Message
        {
            Id = this.Id,
            Text = this.Text,
            GroupId = this.GroupId,
            CreatedAt = this.CreatedAt
        };
    }
}
