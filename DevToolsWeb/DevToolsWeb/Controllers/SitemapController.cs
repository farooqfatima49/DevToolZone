using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml.Linq;

namespace DevToolsWeb.Controllers
{
    public class SitemapController : Controller
    {
        public IActionResult Index()
        {
            // Base URL
            string baseUrl = $"{Request.Scheme}://{Request.Host}";

            // List all your static pages / tools
            var urls = new[]
            {
                "/",
                "/json-formatter",
                "/json-comparer",
                "/json-converter",
                "/json-to-csharp","/json-to-typescript","/json-to-sql",
                "/contact"
            };

            XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";
            var sitemap = new XDocument(new XDeclaration("1.0", "utf-8", "yes"),
                new XElement(ns + "urlset",
                    urls.Select(u =>
                        new XElement(ns + "url",
                            new XElement(ns + "loc", baseUrl + u),
                            new XElement(ns + "changefreq", "weekly"),
                            new XElement(ns + "priority", "0.8")
                        )
                    )
                )
            );

            return Content(sitemap.ToString(), "application/xml", Encoding.UTF8);
        }
    }
}
