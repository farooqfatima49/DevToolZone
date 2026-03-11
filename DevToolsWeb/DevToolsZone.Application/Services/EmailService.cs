using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendEmailAsync(string subject, string body)
        {
          
            using (MailMessage mail = new MailMessage())
            {
                mail.From = new MailAddress( _settings.SenderEmail);
                mail.To.Add(_settings.SenderEmail);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true; // Set to true if using HTML in the body

                using (System.Net.Mail.SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                {
                    smtp.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
                    smtp.EnableSsl = true;
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                    // smtp.UseDefaultCredentials = false; // This is set implicitly by providing credentials

                    try
                    {
                        await smtp.SendMailAsync(mail);
                        Console.WriteLine("Email sent successfully!");
                    }
                    catch (SmtpException ex)
                    {
                        Console.WriteLine($"SMTP Error: {ex.Message}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error: {ex.Message}");
                    }
                }
            }

        }
    }
}
