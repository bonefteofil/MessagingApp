using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class MessagesController : ControllerBase
{
    [HttpGet]
    public IEnumerable<Message> Get()
    {
        return
        [
            new Message { Id = 1, Text = "Message 1" },
            new Message { Id = 2, Text = "Message 2" },
            new Message { Id = 3, Text = "Message 3" }
        ];
    }
}