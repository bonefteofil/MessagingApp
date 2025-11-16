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
