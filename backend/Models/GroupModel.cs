using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class GroupDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
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

public class InboxGroupDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
}

[Table("Inbox_Groups")]
public class SupabaseInboxGroup : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    [Column("last_message")]
    public string? LastMessage { get; set; }
    [Column("last_message_at")]
    public DateTime? LastMessageTime { get; set; }

    public InboxGroupDTO ToDTO()
    {
        return new InboxGroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt,
            LastMessage = this.LastMessage,
            LastMessageAt = this.LastMessageTime
        };
    }
}

[Table("Groups_Members")]
public class SupabaseGroupMember : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("group_id")]
    public int GroupId { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
}
