package com.gracearena.resort;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Base for the end-to-end API tests. Every test shares one application context and
 * therefore one in-memory database, so accounts are created with unique addresses
 * and stays are booked in non-overlapping date windows.
 */
@SpringBootTest(properties = {
		"app.mail.expose-verification-link=true",
		"app.seed.demo-accounts=true",
		"app.seed.admin-password=test-admin-password",
		"logging.level.com.gracearena.resort=WARN"
})
@AutoConfigureMockMvc
abstract class ApiTestSupport {

	private static final AtomicInteger SEQUENCE = new AtomicInteger();

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected ObjectMapper objectMapper;

	protected static String uniqueEmail(String prefix) {
		return prefix + "-" + SEQUENCE.incrementAndGet() + "-" + UUID.randomUUID().toString().substring(0, 6)
				+ "@example.test";
	}

	protected String json(Object body) throws Exception {
		return objectMapper.writeValueAsString(body);
	}

	protected JsonNode postJson(String path, Object body, String bearerToken) throws Exception {
		var request = post(path).contentType(MediaType.APPLICATION_JSON).content(json(body));
		if (bearerToken != null) {
			request = request.header("Authorization", "Bearer " + bearerToken);
		}
		String response = mockMvc.perform(request).andReturn().getResponse().getContentAsString();
		return objectMapper.readTree(response);
	}

	/** Registers an account, confirms it, and returns a usable bearer token. */
	protected String registerAndVerify(String email, String password) throws Exception {
		JsonNode registration = postJson("/v1/auth/register", Map.of(
				"firstName", "Test",
				"lastName", "Guest",
				"email", email,
				"phone", "+234 800 000 0000",
				"password", password), null);

		String verificationUrl = registration.path("data").path("verificationUrl").asText();
		String token = UriComponentsBuilder.fromUriString(verificationUrl).build()
				.getQueryParams().getFirst("token");

		JsonNode verified = postJson("/v1/auth/verify", Map.of("token", token), null);
		return verified.path("data").path("token").asText();
	}

	protected String signIn(String email, String password) throws Exception {
		return postJson("/v1/auth/login", Map.of("email", email, "password", password), null)
				.path("data").path("token").asText();
	}

	protected String adminToken() throws Exception {
		return signIn("admin@gracearenaresort.com", "test-admin-password");
	}
}
