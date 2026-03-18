using Microsoft.AspNetCore.Mvc;

namespace DevToolsWeb.Controllers
{
    public class BaseConverterController : Controller
    {
        [Route("base64-encoder-decoder")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
