namespace DevToolsZone.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Services.Email;
    using System.Threading.Tasks;

    public class ContactController : Controller
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [Route("contact")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("contact/send")]
        public async Task<IActionResult> Send([FromBody] ContactViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var body = $"Name: {model.Name}\nEmail: {model.Email}\n\nMessage:\n{model.Message}";

            await _emailService.SendEmailAsync(model.Subject, body);

            return Ok(new { message = "Message sent successfully!" });
        }
    }
}
