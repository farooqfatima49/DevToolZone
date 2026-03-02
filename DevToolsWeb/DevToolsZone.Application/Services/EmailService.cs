using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(/*IOptions<EmailSettings> settings*/)
        {
            // _settings = settings.Value;
        }

        public async Task SendEmailAsync(string subject, string body)
        {
            //var email = new MimeMessage();
            //email.From.Add(new MailboxAddress(_settings.SenderName, _settings.SenderEmail));
            //email.To.Add(MailboxAddress.Parse(_settings.SenderEmail));
            //email.Subject = subject;

            //email.Body = new TextPart("plain") { Text = body };

            //using var smtp = new SmtpClient();
            //await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, false);
            //await smtp.AuthenticateAsync(_settings.Username, _settings.Password);
            //await smtp.SendAsync(email);
            //await smtp.DisconnectAsync(true);
        }
    }
}
