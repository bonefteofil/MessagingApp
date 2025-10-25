using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
public class StatusController : ControllerBase
{
    [HttpGet]
    [Route("status")]
    public ActionResult GetStatus()
    {
        return Ok();
    }
}