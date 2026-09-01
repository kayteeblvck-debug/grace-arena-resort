package com.gracearena.resort.security;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.gracearena.resort.user.User;
import com.gracearena.resort.user.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Turns an {@code Authorization: Bearer <jwt>} header into an authenticated
 * {@link User} principal. Requests without a usable token pass through
 * unauthenticated and are rejected later by the authorization rules.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private static final String PREFIX = "Bearer ";

	private final JwtService jwtService;
	private final UserRepository userRepository;

	public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
		this.jwtService = jwtService;
		this.userRepository = userRepository;
	}

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
			@NonNull FilterChain filterChain) throws ServletException, IOException {

		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith(PREFIX)
				&& SecurityContextHolder.getContext().getAuthentication() == null) {

			Long userId = jwtService.readUserId(header.substring(PREFIX.length()).trim());
			if (userId != null) {
				userRepository.findById(userId)
						.filter(User::isEmailVerified)
						.ifPresent(user -> authenticate(user, request));
			}
		}

		filterChain.doFilter(request, response);
	}

	private void authenticate(User user, HttpServletRequest request) {
		var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
		var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
		SecurityContextHolder.getContext().setAuthentication(authentication);
	}
}
