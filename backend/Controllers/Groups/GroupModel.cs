using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

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
public class SupabaseMemberWithUsername : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    [Column("group_id")]
    public int GroupId { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }
    [Column("username")]
    public SupabaseUser? User { get; set; }

    public GroupMemberDTO ToDTO()
    {
        return new GroupMemberDTO
        {
            Id = this.Id,
            GroupId = this.GroupId,
            UserId = this.UserId,
            Username = this.User?.Username,
            CreatedAt = this.CreatedAt
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