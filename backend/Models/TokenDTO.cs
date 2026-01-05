namespace backend.Models;

public class RefreshTokenDTO
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Expired { get; set; }
    public bool Revoked { get; set; }
    public string? DeviceName { get; set; }
}