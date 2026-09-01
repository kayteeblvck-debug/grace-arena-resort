package com.gracearena.resort.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.gracearena.resort.common.ApiResponse;
import com.gracearena.resort.user.AuthDtos.AuthResponse;
import com.gracearena.resort.user.AuthDtos.EmailRequest;
import com.gracearena.resort.user.AuthDtos.LoginRequest;
import com.gracearena.resort.user.AuthDtos.RegisterRequest;
import com.gracearena.resort.user.AuthDtos.RegistrationResponse;
import com.gracearena.resort.user.AuthDtos.UserResponse;
import com.gracearena.resort.user.AuthDtos.VerifyEmailRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public ApiResponse<RegistrationResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ApiResponse.ok("Check your inbox to confirm your email address", authService.register(request));
	}

	@PostMapping("/verify")
	public ApiResponse<AuthResponse> verify(@Valid @RequestBody VerifyEmailRequest request) {
		return ApiResponse.ok("Your email address is confirmed", authService.verifyEmail(request.token()));
	}

	@PostMapping("/resend-verification")
	public ApiResponse<Void> resendVerification(@Valid @RequestBody EmailRequest request) {
		authService.resendVerification(request.email());
		return ApiResponse.ok("If that address has an unconfirmed account, a new link is on its way", null);
	}

	@PostMapping("/login")
	public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ApiResponse.ok("Signed in", authService.login(request));
	}

	/** Used by the client on boot to check a stored token is still good. */
	@GetMapping("/me")
	public ApiResponse<UserResponse> me(@AuthenticationPrincipal User user) {
		return ApiResponse.ok(UserResponse.from(user));
	}
}
