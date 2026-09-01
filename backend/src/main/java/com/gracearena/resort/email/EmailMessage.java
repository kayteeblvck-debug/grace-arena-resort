package com.gracearena.resort.email;

/**
 * One outbound email. {@code text} is the plain-text alternative shown by clients
 * that refuse HTML, and is what {@link LoggingEmailSender} prints in development.
 */
public record EmailMessage(String to, String subject, String html, String text) {
}
