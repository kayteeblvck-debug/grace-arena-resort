package com.gracearena.resort.common;

import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
		return status(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiResponse<Void>> handleBadRequest(BadRequestException ex) {
		return status(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	/**
	 * 403 rather than 400 so the sign-in screen can tell "confirm your email" apart
	 * from a wrong password and offer to resend the link.
	 */
	@ExceptionHandler(EmailNotVerifiedException.class)
	public ResponseEntity<ApiResponse<Void>> handleUnverified(EmailNotVerifiedException ex) {
		return status(HttpStatus.FORBIDDEN, ex.getMessage());
	}

	/**
	 * Method-level @PreAuthorize failures surface here, before Spring Security's own
	 * handler would see them. Answering explicitly keeps the envelope consistent.
	 */
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
		return status(HttpStatus.FORBIDDEN, "You do not have access to this resource");
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(error -> error.getField() + " " + error.getDefaultMessage())
				.collect(Collectors.joining("; "));
		return status(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ApiResponse<Void>> handleMissingParam(MissingServletRequestParameterException ex) {
		return status(HttpStatus.BAD_REQUEST, ex.getParameterName() + " is required");
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		return status(HttpStatus.BAD_REQUEST, ex.getName() + " is not in the expected format");
	}

	/** Malformed JSON, or a value that is not one of an enum's names. */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse<Void>> handleUnreadable(HttpMessageNotReadableException ex) {
		return status(HttpStatus.BAD_REQUEST, "The request body could not be read. Please check the values sent.");
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiResponse<Void>> handleConflict(DataIntegrityViolationException ex) {
		log.warn("Data integrity violation", ex);
		return status(HttpStatus.CONFLICT, "That record conflicts with one that already exists.");
	}

	/** Nothing internal leaks to the client; the detail goes to the log instead. */
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception ex) {
		log.error("Unhandled exception", ex);
		return status(HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong on our side. Please try again.");
	}

	private static ResponseEntity<ApiResponse<Void>> status(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(ApiResponse.error(message));
	}
}
