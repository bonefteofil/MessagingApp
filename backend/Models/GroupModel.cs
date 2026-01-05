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
    [Column("owner_id")]
    public int OwnerId { get; set; }
    [Column("public")]
    public bool Public { get; set; }

    public GroupDTO ToDTO()
    {
        return new GroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt,
            OwnerId = this.OwnerId,
            Public = this.Public
        };
    }
}

[Table("Groups")]
public class SupabaseGroupWithUsername : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("name")]
    public string? Name { get; set; }
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; }
    [Column("owner_id")]
    public int OwnerId { get; set; }
    [Column("public")]
    public bool Public { get; set; }
    [Column("username")]
    public SupabaseUser? Owner { get; set; }

    public GroupDTO ToDTO()
    {
        return new GroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt,
            OwnerId = this.OwnerId,
            Owner = this.Owner?.Username,
            Public = this.Public
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
    public DateTime? LastMessageAt { get; set; }
    [Column("public")]
    public bool Public { get; set; }
    public InboxGroupDTO ToDTO()
    {
        return new InboxGroupDTO
        {
            Id = this.Id,
            Name = this.Name,
            CreatedAt = this.CreatedAt,
            LastMessage = this.LastMessage,
            LastMessageAt = this.LastMessageAt,
            Public = this.Public
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