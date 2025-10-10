using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("status")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public ActionResult GetStatus()
    {
        return Ok();
    }
}