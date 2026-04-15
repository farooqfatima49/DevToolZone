using Microsoft.AspNetCore.ResponseCompression;
using Services;
using Services.Email;
using System.IO.Compression;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.Configure<EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true; // Important
    options.Providers.Add<GzipCompressionProvider>();
});

// Set compression level
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest; // or Optimal
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapControllerRoute(
    name: "jsonFormatter",
    pattern: "json-formatter",
    defaults: new { controller = "JsonFormatter", action = "Index" }
);
app.MapControllerRoute(
    name: "jsonConverter",
    pattern: "json-converter",
    defaults: new { controller = "JsonFormatter", action = "Converter" }
);
app.MapControllerRoute(
    name: "jsonConverter",
    pattern: "json-to-{type}",
    defaults: new { controller = "JsonConverter", action = "ModelConverter" });
app.MapControllerRoute(
    name: "contact",
    pattern: "contact",
    defaults: new { controller = "Contact", action = "Index" }
);
app.MapControllerRoute(
    name: "sitemap",
    pattern: "sitemap.xml",
    defaults: new { controller = "Sitemap", action = "Index" }
);
app.MapControllerRoute(
    name: "about",
    pattern: "about",
    defaults: new { controller = "Home", action = "About" }
);
app.MapControllerRoute(
    name: "terms",
    pattern: "terms-and-conditions",
    defaults: new { controller = "Home", action = "Terms" }
);

 app.MapControllerRoute(
    name: "privacy",
    pattern: "privacy-policy",
    defaults: new { controller = "Home", action = "Privacy" }
);
app.MapControllerRoute(
    name: "faq",
    pattern: "faq",
    defaults: new { controller = "Home", action = "Faq" }
);
app.MapControllerRoute(
    name: "base64converter",
    pattern: "base64-encoder-decoder",
    defaults: new { controller = "BaseConverter", action = "Index" }
);
app.MapControllerRoute(
    name: "jsonobfuscator",
    pattern: "javascript-obfuscator",
    defaults: new { controller = "JavascriptFormatter", action = "Index" }
);
app.MapControllerRoute(
    name: "tools",
    pattern: "tools",
    defaults: new { controller = "Home", action = "AllTools" }
);
app.UseResponseCompression();

app.UseStaticFiles();

app.MapControllers();
app.Run();
