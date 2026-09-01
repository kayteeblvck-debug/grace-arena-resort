package com.gracearena.resort.email;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Sends through the configured SMTP server as a multipart alternative (plain text
 * plus HTML). Used whenever {@code spring.mail.host} is set.
 */
public class SmtpEmailSender implements EmailSender {

	private static final Logger log = LoggerFactory.getLogger(SmtpEmailSender.class);

	private final JavaMailSender mailSender;
	private final MailProperties properties;

	public SmtpEmailSender(JavaMailSender mailSender, MailProperties properties) {
		this.mailSender = mailSender;
		this.properties = properties;
	}

	@Override
	public void send(EmailMessage message) {
		try {
			MimeMessage mime = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mime, true, StandardCharsets.UTF_8.name());
			helper.setFrom(properties.from(), properties.fromName());
			helper.setTo(message.to());
			helper.setSubject(message.subject());
			helper.setText(message.text(), message.html());
			mailSender.send(mime);
			log.info("Sent '{}' to {}", message.subject(), message.to());
		} catch (MessagingException | UnsupportedEncodingException | RuntimeException ex) {
			// Deliberately swallowed — the caller's transaction is more important than
			// the email. Verification mail can be re-requested from the sign-in page.
			log.error("Could not send '{}' to {}: {}", message.subject(), message.to(), ex.getMessage(), ex);
		}
	}
}
