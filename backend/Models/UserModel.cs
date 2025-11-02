using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

public class UserDTO
{
    public int Id { get; set; }
    public string? Username { get; set; }
}

public class LoginModel
{
    public string? Username { get; set; }
    public string? DeviceName { get; set; }
}

[Table("Users")]
public class SupabaseUser : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
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