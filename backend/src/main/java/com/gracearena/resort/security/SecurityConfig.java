package com.gracearena.resort.security;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Stateless bearer-token security. Everything the public site needs is open;
 * anything tied to a guest — their bookings, their profile — needs a token, and the
 * reservations desk views additionally need the ADMIN role.
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final RestAuthErrorHandler authErrorHandler;
	private final CorsConfigurationSource corsConfigurationSource;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, RestAuthErrorHandler authErrorHandler,
			CorsConfigurationSource corsConfigurationSource) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
		this.authErrorHandler = authErrorHandler;
		this.corsConfigurationSource = corsConfigurationSource;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
				.exceptionHandling(handling -> handling
						.authenticationEntryPoint(authErrorHandler)
						.accessDeniedHandler(authErrorHandler))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(PathRequest.toH2Console()).permitAll()
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/v1/health").permitAll()
						// Note: /v1/auth/me is deliberately absent — it needs a token.
						.requestMatchers(HttpMethod.POST, "/v1/auth/register", "/v1/auth/login",
								"/v1/auth/verify", "/v1/auth/resend-verification")
						.permitAll()
						.requestMatchers(HttpMethod.GET, "/v1/rooms", "/v1/rooms/**", "/v1/availability")
						.permitAll()
						.requestMatchers(HttpMethod.POST, "/v1/enquiries").permitAll()
						.requestMatchers("/v1/enquiries/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/v1/bookings").hasRole("ADMIN")
						.requestMatchers("/v1/bookings/**").authenticated()
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
