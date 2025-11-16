using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

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