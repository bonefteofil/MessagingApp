using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class UserDTO
{
    public string? Id { get; set; }
    public string? Username { get; set; }
}

[Table("Users")]
public class SupabaseUser : BaseModel
{
    [PrimaryKey("id")]
    public string? Id { get; set; }
    [Column("username")]
    public string? Username { get; set; }

    public UserDTO ToDTO()
    {
        return new UserDTO
        {
            Id = this.Id,
            Username = this.Username
        };
    }
}
