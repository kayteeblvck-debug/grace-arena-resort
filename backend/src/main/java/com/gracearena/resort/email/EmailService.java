package com.gracearena.resort.email;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.springframework.stereotype.Service;

/**
 * Composes every message the site sends. Delivery itself is delegated to an
 * {@link EmailSender}, which is either SMTP or the logging fallback.
 */
@Service
public class EmailService {

	private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH);

	private final EmailSender sender;
	private final MailProperties properties;

	public EmailService(EmailSender sender, MailProperties properties) {
		this.sender = sender;
		this.properties = properties;
	}

	public void sendVerificationEmail(String to, String firstName, String verificationUrl, int ttlHours) {
		String name = EmailTemplates.escape(firstName);
		String html = EmailTemplates.layout(
				"Confirm your email address",
				"""
						<p>Welcome, %s.</p>
						<p>Your Grace Arena Resorts account is one click away. Confirm this address to
						activate it, then sign in to reserve suites and follow your stays.</p>
						%s
						<p style="font-size:13px;color:#8a8272;">This link expires in %d hours. If the button
						does not open, paste this address into your browser:<br>
						<span style="word-break:break-all;">%s</span></p>
						<p style="font-size:13px;color:#8a8272;">If you did not create this account you can
						safely ignore this message.</p>
						"""
						.formatted(name, EmailTemplates.button(verificationUrl, "Confirm my email"), ttlHours,
								EmailTemplates.escape(verificationUrl)));

		String text = """
				Welcome, %s.

				Confirm your email address to activate your Grace Arena Resorts account:
				%s

				This link expires in %d hours. If you did not create this account, ignore this message.
				""".formatted(firstName, verificationUrl, ttlHours);

		sender.send(new EmailMessage(to, "Confirm your Grace Arena Resorts account", html, text));
	}

	public void sendWelcomeEmail(String to, String firstName, String signInUrl) {
		String html = EmailTemplates.layout(
				"Your account is ready",
				"""
						<p>Thank you, %s — your email is confirmed.</p>
						<p>You can now reserve any of our suites and villas, hold dates for an event at
						the Arena, and see every booking in one place.</p>
						%s
						<p>Ẹ káàbọ̀. We look forward to welcoming you to Onimangoro.</p>
						"""
						.formatted(EmailTemplates.escape(firstName),
								EmailTemplates.button(signInUrl, "Sign in")));

		String text = """
				Thank you, %s — your email is confirmed.

				Sign in to reserve a suite and manage your stays: %s

				We look forward to welcoming you to Onimangoro.
				""".formatted(firstName, signInUrl);

		sender.send(new EmailMessage(to, "Your Grace Arena Resorts account is ready", html, text));
	}

	/** Confirmation to the guest, plus a copy to the reservations desk. */
	public void sendBookingReceived(BookingEmailDetails booking, String manageUrl) {
		String summary = EmailTemplates.detailRows(
				"Reference", booking.reference(),
				"Suite", booking.roomName(),
				"Arrival", DATE.format(booking.checkIn()),
				"Departure", DATE.format(booking.checkOut()),
				"Nights", String.valueOf(booking.nights()),
				"Guests", String.valueOf(booking.guests()),
				"Estimated total", naira(booking.totalAmount()));

		String guestHtml = EmailTemplates.layout(
				"We have your reservation",
				"""
						<p>Dear %s,</p>
						<p>Thank you for choosing Grace Arena Resorts. Your request is with our
						reservations desk and is confirmed as soon as it is reviewed — usually within
						a few hours.</p>
						%s
						%s
						<p style="font-size:13px;color:#8a8272;">Quote reference <strong>%s</strong> in any
						correspondence about this stay.</p>
						"""
						.formatted(EmailTemplates.escape(booking.guestName()), summary,
								EmailTemplates.button(manageUrl, "View my booking"),
								EmailTemplates.escape(booking.reference())));

		String guestText = """
				Dear %s,

				Thank you for choosing Grace Arena Resorts. We have received your reservation.

				Reference:  %s
				Suite:      %s
				Arrival:    %s
				Departure:  %s
				Nights:     %d
				Guests:     %d
				Estimated:  %s

				Manage this booking: %s
				""".formatted(booking.guestName(), booking.reference(), booking.roomName(),
				DATE.format(booking.checkIn()), DATE.format(booking.checkOut()), booking.nights(),
				booking.guests(), naira(booking.totalAmount()), manageUrl);

		sender.send(new EmailMessage(booking.guestEmail(),
				"Reservation " + booking.reference() + " — Grace Arena Resorts", guestHtml, guestText));

		String deskHtml = EmailTemplates.layout("New reservation",
				summary + EmailTemplates.detailRows(
						"Guest", booking.guestName(),
						"Email", booking.guestEmail(),
						"Phone", booking.guestPhone() == null ? "—" : booking.guestPhone(),
						"Requests", booking.specialRequests() == null ? "—" : booking.specialRequests()));

		sender.send(new EmailMessage(properties.reservationsInbox(),
				"New reservation " + booking.reference() + " — " + booking.roomName(), deskHtml, guestText));
	}

	/** Acknowledgement to the enquirer, plus the enquiry itself to the desk. */
	public void sendEnquiryReceived(EnquiryEmailDetails enquiry) {
		String detail = EmailTemplates.detailRows(
				"Reference", enquiry.reference(),
				"Name", enquiry.name(),
				"Email", enquiry.email(),
				"Phone", enquiry.phone() == null ? "—" : enquiry.phone(),
				"Subject", enquiry.subject(),
				"Preferred date", enquiry.preferredDate() == null ? "—" : DATE.format(enquiry.preferredDate()),
				"Expected guests", enquiry.expectedGuests() == null ? "—" : String.valueOf(enquiry.expectedGuests()));

		String ackHtml = EmailTemplates.layout("Thank you for writing to us",
				"""
						<p>Dear %s,</p>
						<p>We have your enquiry and a member of our team will reply personally, usually
						within one business day.</p>
						%s
						"""
						.formatted(EmailTemplates.escape(enquiry.name()), detail));

		String ackText = """
				Dear %s,

				We have your enquiry (reference %s) and will reply personally, usually within one
				business day.

				Grace Arena Resorts
				""".formatted(enquiry.name(), enquiry.reference());

		sender.send(new EmailMessage(enquiry.email(), "We received your enquiry — Grace Arena Resorts",
				ackHtml, ackText));

		String deskHtml = EmailTemplates.layout("New enquiry",
				detail + "<p style=\"white-space:pre-wrap;\">%s</p>".formatted(EmailTemplates.escape(enquiry.message())));

		sender.send(new EmailMessage(properties.reservationsInbox(),
				"Enquiry " + enquiry.reference() + " — " + enquiry.subject(), deskHtml,
				enquiry.name() + " <" + enquiry.email() + ">\n\n" + enquiry.message()));
	}

	private static String naira(BigDecimal amount) {
		return "₦" + String.format(Locale.ENGLISH, "%,.0f", amount);
	}
}
