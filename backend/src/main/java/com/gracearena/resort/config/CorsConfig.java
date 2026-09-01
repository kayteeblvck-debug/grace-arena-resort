package com.gracearena.resort.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Lets the Vite dev server (localhost:5173) call the API. Deployed origins go in
 * app.cors.allowed-origins (APP_CORS_ALLOWED_ORIGINS), comma separated.
 *
 * Exposed as a CorsConfigurationSource rather than a WebMvcConfigurer so the Spring
 * Security filter chain picks up the same rules.
 */
@Configuration
public class CorsConfig {

	private final List<String> allowedOrigins;

	public CorsConfig(@Value("${app.cors.allowed-origins}") List<String> allowedOrigins) {
		this.allowedOrigins = allowedOrigins;
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOrigins(allowedOrigins);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);
		config.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
