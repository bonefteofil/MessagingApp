using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

[Table("Users")]
public class SupabaseUser : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("username")]
    public string? Username { get; set; }
    [Column("password_hash")]
    public string? PasswordHash { get; set; }

    public UserDTO ToDTO()
    {
        return new UserDTO
        {
            Id = this.Id,
            Username = this.Username
        };
    }

    public GroupMemberDTO ToGroupMemberDTO(int groupId, DateTime createdAt)
    {
        return new GroupMemberDTO
        {
            Id = this.Id,
            UserId = this.Id,
            GroupId = groupId,
            Username = this.Username,
            CreatedAt = createdAt
        };
    }
}