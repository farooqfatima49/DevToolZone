using Microsoft.AspNetCore.Mvc;

namespace DevToolsWeb.Controllers
{
    public class JavascriptFormatterController : Controller
    {
        
        [Route("javascript-obfuscator")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
