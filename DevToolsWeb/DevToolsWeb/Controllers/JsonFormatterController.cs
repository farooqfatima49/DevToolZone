namespace DevToolsZone.Controllers
{
    public class JsonFormatterController : Controller
    {
        private readonly ILogger<JsonFormatterController> _logger;

        public JsonFormatterController(ILogger<JsonFormatterController> logger)
        {
            _logger = logger;
        }
        
        [Route("json-formatter")]
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        [Route("json-to-{type}")]
        public IActionResult ModelConverter(string type)
        {
            ViewBag.Type = type?.ToLower();
            return View("Converter");
        }

        [Route("json-converter")]
        public IActionResult Converter()
        {
            ViewBag.Type = "csharp"; // default
            return View();
        }
        [Route("json-comparer")]
        public IActionResult Comparer()
        {
            return View();
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
