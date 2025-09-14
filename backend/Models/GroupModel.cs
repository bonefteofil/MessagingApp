using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class GroupDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
}

[Table("Groups")]
public class SupabaseGroup : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }

    public GroupDTO ToDTO()
    {
        return new GroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt
        };
    }
}

[Table("groups_with_last_message")]
public class SupabaseGroupWithLastMessage : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("group_created_at")]
    public DateTime CreatedAt { get; set; }
    [Column("last_message_sent")]
    public string? LastMessageSent { get; set; }
    [Column("last_message_sent_at")]
    public DateTime? LastMessageTime { get; set; }

    public GroupDTO ToDTO()
    {
        return new GroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt,
            LastMessage = this.LastMessageSent,
            LastMessageAt = this.LastMessageTime
        };
    }
}