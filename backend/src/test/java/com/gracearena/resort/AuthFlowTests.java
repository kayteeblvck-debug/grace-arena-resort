package com.gracearena.resort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.JsonNode;

/** Register, confirm the address, sign in. */
class AuthFlowTests extends ApiTestSupport {

	@Test
	void registerThenVerifyThenUseTheToken() throws Exception {
		String email = uniqueEmail("verified");
		String token = registerAndVerify(email, "SuperSecret123");

		assertThat(token).isNotBlank();

		mockMvc.perform(get("/v1/auth/me").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.email").value(email))
				.andExpect(jsonPath("$.data.emailVerified").value(true))
				.andExpect(jsonPath("$.data.role").value("GUEST"));
	}

	@Test
	void registrationDoesNotHandOutATokenBeforeTheAddressIsConfirmed() throws Exception {
		JsonNode response = postJson("/v1/auth/register", Map.of(
				"firstName", "Unconfirmed",
				"lastName", "Guest",
				"email", uniqueEmail("pending"),
				"password", "SuperSecret123"), null);

		assertThat(response.path("data").has("token")).isFalse();
		assertThat(response.path("data").path("user").path("emailVerified").asBoolean()).isFalse();
	}

	@Test
	void signingInBeforeConfirmingIsRejectedWithAThreeOhThree() throws Exception {
		String email = uniqueEmail("unconfirmed");
		postJson("/v1/auth/register", Map.of(
				"firstName", "Unconfirmed",
				"lastName", "Guest",
				"email", email,
				"password", "SuperSecret123"), null);

		mockMvc.perform(post("/v1/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(json(Map.of("email", email, "password", "SuperSecret123"))))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value(Matchers.containsString("confirm your email")));
	}

	@Test
	void theSameAddressCannotRegisterTwice() throws Exception {
		String email = uniqueEmail("duplicate");
		Map<String, String> body = Map.of(
				"firstName", "First",
				"lastName", "Attempt",
				"email", email,
				"password", "SuperSecret123");

		postJson("/v1/auth/register", body, null);
		JsonNode second = postJson("/v1/auth/register", body, null);

		assertThat(second.path("success").asBoolean()).isFalse();
		assertThat(second.path("message").asText()).contains("already exists");
	}

	/**
	 * Addresses are stored lower-cased, so the capitalisation someone types on their
	 * phone keyboard does not lock them out. Surrounding whitespace is trimmed by the
	 * form before it is sent — @Email would reject it here, and trimming every string
	 * server-side would also silently trim passwords.
	 */
	@Test
	void addressComparisonIgnoresCase() throws Exception {
		String email = uniqueEmail("mixedcase");
		registerAndVerify(email, "SuperSecret123");

		assertThat(signIn(email.toUpperCase(), "SuperSecret123")).isNotBlank();
	}

	@Test
	void aConfirmationLinkOnlyWorksOnce() throws Exception {
		JsonNode registration = postJson("/v1/auth/register", Map.of(
				"firstName", "Replay",
				"lastName", "Guest",
				"email", uniqueEmail("replay"),
				"password", "SuperSecret123"), null);

		String url = registration.path("data").path("verificationUrl").asText();
		String verificationToken = url.substring(url.indexOf("token=") + 6);

		assertThat(postJson("/v1/auth/verify", Map.of("token", verificationToken), null)
				.path("success").asBoolean()).isTrue();

		JsonNode replay = postJson("/v1/auth/verify", Map.of("token", verificationToken), null);
		assertThat(replay.path("success").asBoolean()).isFalse();
		assertThat(replay.path("message").asText()).contains("already been used");
	}

	@Test
	void aMadeUpConfirmationTokenIsRefused() throws Exception {
		JsonNode response = postJson("/v1/auth/verify", Map.of("token", "not-a-real-token"), null);
		assertThat(response.path("success").asBoolean()).isFalse();
	}

	@Test
	void wrongPasswordDoesNotSayWhichHalfWasWrong() throws Exception {
		String email = uniqueEmail("wrongpass");
		registerAndVerify(email, "SuperSecret123");

		JsonNode response = postJson("/v1/auth/login", Map.of("email", email, "password", "NotThePassword"), null);
		assertThat(response.path("message").asText()).isEqualTo("That email and password combination is not recognised.");
	}

	@Test
	void resendingAVerificationLinkNeverRevealsWhetherTheAccountExists() throws Exception {
		JsonNode unknown = postJson("/v1/auth/resend-verification",
				Map.of("email", "nobody-at-all@example.test"), null);

		assertThat(unknown.path("success").asBoolean()).isTrue();
	}

	@Test
	void meRequiresAToken() throws Exception {
		mockMvc.perform(get("/v1/auth/me"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void shortPasswordsAreRejected() throws Exception {
		JsonNode response = postJson("/v1/auth/register", Map.of(
				"firstName", "Short",
				"lastName", "Password",
				"email", uniqueEmail("short"),
				"password", "abc"), null);

		assertThat(response.path("success").asBoolean()).isFalse();
		assertThat(response.path("message").asText()).contains("password");
	}
}
