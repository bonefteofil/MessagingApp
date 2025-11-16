namespace backend.Models;

public class GroupDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class InboxGroupDTO
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? LastMessage { get; set; }
    public DateTime? LastMessageAt { get; set; }
}

public class GroupMemberDTO
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public int UserId { get; set; }
    public string? Username { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class GroupFormDTO
{
    public string? Name { get; set; }
    public List<int> MembersIds { get; set; } = [];
}