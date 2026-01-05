using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models;

[Table("RefreshTokens")]
public class SupabaseRefreshToken : BaseModel
{
    [PrimaryKey("id")]
    public int Id { get; set; }
    [Column("user_id")]
    public int UserId { get; set; }
    [Column("token_hash")]
    public string? TokenHash { get; set; }
    [Column("created_at")]
    public DateTime CreatedAt { get; set; }
    [Column("expires_at")]
    public DateTime ExpiresAt { get; set; }
    [Column("revoked")]
    public bool Revoked { get; set; }
    [Column("device_name")]
    public string? DeviceName { get; set; }

    public RefreshTokenDTO ToDTO()
    {
        return new RefreshTokenDTO
        {
            Id = this.Id,
            CreatedAt = this.CreatedAt,
            Expired = this.ExpiresAt < DateTime.UtcNow,
            Revoked = this.Revoked,
            DeviceName = this.DeviceName
        };
    }
}