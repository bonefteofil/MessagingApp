namespace backend.Models;

public class MessageDTO
{
    public int Id { get; set; }
    public string? Text { get; set; }
    public int GroupId { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool? Edited { get; set; }
    public int UserId { get; set; }
    public string? Username { get; set; }
}
