package com.gracearena.resort.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

import com.gracearena.resort.email.EmailSender;
import com.gracearena.resort.email.LoggingEmailSender;
import com.gracearena.resort.email.MailProperties;
import com.gracearena.resort.email.SmtpEmailSender;

/**
 * Picks the mail transport. Spring Boot only auto-configures a {@link JavaMailSender}
 * when {@code spring.mail.host} is set, so an unset host means "log, do not send".
 */
@Configuration
public class MailConfig {

	private static final Logger log = LoggerFactory.getLogger(MailConfig.class);

	@Bean
	public EmailSender emailSender(ObjectProvider<JavaMailSender> mailSender, MailProperties properties) {
		JavaMailSender configured = mailSender.getIfAvailable();
		if (configured == null) {
			log.warn("No spring.mail.host configured — emails will be written to the log, not sent.");
			return new LoggingEmailSender();
		}
		log.info("SMTP configured; sending mail as {} <{}>", properties.fromName(), properties.from());
		return new SmtpEmailSender(configured, properties);
	}
}
