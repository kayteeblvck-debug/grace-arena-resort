package com.gracearena.resort.email;

/**
 * Transport for outbound mail. Implementations must never throw: a mail server
 * being down should not fail a registration or a booking.
 */
public interface EmailSender {

	void send(EmailMessage message);
}
