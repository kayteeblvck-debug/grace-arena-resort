package com.gracearena.resort.common;

/**
 * Thrown when credentials are correct but the address has never been confirmed.
 * Mapped to 403 so the sign-in screen can tell it apart from a wrong password and
 * offer to resend the link.
 */
public class EmailNotVerifiedException extends RuntimeException {

	public EmailNotVerifiedException(String message) {
		super(message);
	}
}
