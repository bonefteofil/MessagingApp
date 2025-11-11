using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class MessageDTO
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public int GroupId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool? Edited { get; set; }
    public int UserId { get; set; }
    public string? Username { get; set; }
}

[Table("Messages")]
public class SupabaseMessage : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("text")]
    public string? Text { get; set; }
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }
    [Column("edited")]
    public bool Edited { get; set; }
    [Column("group_id")]
    public int GroupId { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }

    public MessageDTO ToDTO()
    {
        return new MessageDTO
        {
            Id = this.Id,
            Text = this.Text,
            CreatedAt = this.CreatedAt,
            Edited = this.Edited,
            GroupId = this.GroupId,
            UserId = this.UserId
        };
    }
}
    

[Table("Messages")]
public class SupabaseMessageWithUsername : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("text")]
    public string? Text { get; set; }
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }
    [Column("edited")]
    public bool Edited { get; set; }
    [Column("group_id")]
    public int GroupId { get; set; }
    [Column("user_id")] 
    public int UserId { get; set; }
    [Column("username")]
    public SupabaseUser? User { get; set; }
    
    public MessageDTO ToDTO()
    {
        return new MessageDTO
        {
            Id = this.Id,
            Text = this.Text,
            CreatedAt = this.CreatedAt,
            Edited = this.Edited,
            GroupId = this.GroupId,
            UserId = this.UserId,
            Username = this.User?.Username
        };
    }
}