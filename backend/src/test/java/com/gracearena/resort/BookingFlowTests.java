package com.gracearena.resort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.JsonNode;
import com.gracearena.resort.room.RoomRepository;

/**
 * The rule the scaffold was missing: a room type can only be sold as many times over
 * a date range as it has units.
 */
class BookingFlowTests extends ApiTestSupport {

	@Autowired
	private RoomRepository roomRepository;

	/** One unit only, which makes it the clearest subject for the overlap rule. */
	private Long villaId() {
		return roomRepository.findBySlug("grace-presidential-villa").orElseThrow().getId();
	}

	private Long gardenRoomId() {
		return roomRepository.findBySlug("itura-garden-room").orElseThrow().getId();
	}

	private Map<String, Object> stay(Long roomId, LocalDate from, int nights, int guests) {
		Map<String, Object> body = new HashMap<>();
		body.put("roomId", roomId);
		body.put("checkIn", from.toString());
		body.put("checkOut", from.plusDays(nights).toString());
		body.put("guests", guests);
		return body;
	}

	@Test
	void aGuestCanBookAndThenSeeTheStayInTheirOwnList() throws Exception {
		String email = uniqueEmail("booker");
		String token = registerAndVerify(email, "SuperSecret123");

		JsonNode created = postJson("/v1/bookings",
				stay(gardenRoomId(), LocalDate.now().plusDays(40), 3, 2), token);

		assertThat(created.path("success").asBoolean()).isTrue();
		String reference = created.path("data").path("reference").asText();
		assertThat(reference).startsWith("GAR-");
		assertThat(created.path("data").path("nights").asInt()).isEqualTo(3);
		assertThat(created.path("data").path("status").asText()).isEqualTo("PENDING");
		assertThat(created.path("data").path("guestEmail").asText()).isEqualTo(email);
		// 3 nights at the seeded 85,000 rate.
		assertThat(created.path("data").path("totalAmount").asDouble()).isEqualTo(255000.0);

		mockMvc.perform(get("/v1/bookings/me").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.length()").value(1))
				.andExpect(jsonPath("$.data[0].reference").value(reference));
	}

	@Test
	void aSecondBookingOverTheSameDatesIsRefusedOnceTheTypeIsSoldOut() throws Exception {
		String first = registerAndVerify(uniqueEmail("villa-one"), "SuperSecret123");
		String second = registerAndVerify(uniqueEmail("villa-two"), "SuperSecret123");
		LocalDate arrival = LocalDate.now().plusDays(120);

		assertThat(postJson("/v1/bookings", stay(villaId(), arrival, 4, 4), first)
				.path("success").asBoolean()).isTrue();

		JsonNode clash = postJson("/v1/bookings", stay(villaId(), arrival.plusDays(1), 4, 4), second);

		assertThat(clash.path("success").asBoolean()).isFalse();
		assertThat(clash.path("message").asText()).contains("fully booked");
	}

	@Test
	void aStayStartingOnTheDayAnotherEndsIsAllowed() throws Exception {
		String first = registerAndVerify(uniqueEmail("back-to-back-one"), "SuperSecret123");
		String second = registerAndVerify(uniqueEmail("back-to-back-two"), "SuperSecret123");
		LocalDate arrival = LocalDate.now().plusDays(200);

		assertThat(postJson("/v1/bookings", stay(villaId(), arrival, 2, 2), first)
				.path("success").asBoolean()).isTrue();

		// Checks out on the day the first checks in — the room is free that night.
		JsonNode adjacent = postJson("/v1/bookings", stay(villaId(), arrival.plusDays(2), 2, 2), second);

		assertThat(adjacent.path("success").asBoolean()).isTrue();
	}

	@Test
	void cancellingAStayPutsTheRoomBackOnSale() throws Exception {
		String first = registerAndVerify(uniqueEmail("cancel-one"), "SuperSecret123");
		String second = registerAndVerify(uniqueEmail("cancel-two"), "SuperSecret123");
		LocalDate arrival = LocalDate.now().plusDays(300);

		JsonNode booked = postJson("/v1/bookings", stay(villaId(), arrival, 3, 2), first);
		String reference = booked.path("data").path("reference").asText();

		assertThat(postJson("/v1/bookings", stay(villaId(), arrival, 3, 2), second)
				.path("success").asBoolean()).isFalse();

		mockMvc.perform(post("/v1/bookings/" + reference + "/cancel")
				.header("Authorization", "Bearer " + first))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.status").value("CANCELLED"));

		assertThat(postJson("/v1/bookings", stay(villaId(), arrival, 3, 2), second)
				.path("success").asBoolean()).isTrue();
	}

	@Test
	void aPartyLargerThanTheRoomSleepsIsRefused() throws Exception {
		String token = registerAndVerify(uniqueEmail("too-many"), "SuperSecret123");

		JsonNode response = postJson("/v1/bookings",
				stay(gardenRoomId(), LocalDate.now().plusDays(60), 2, 6), token);

		assertThat(response.path("success").asBoolean()).isFalse();
		assertThat(response.path("message").asText()).contains("sleeps 2");
	}

	@Test
	void departingBeforeArrivingIsRefused() throws Exception {
		String token = registerAndVerify(uniqueEmail("backwards"), "SuperSecret123");
		LocalDate arrival = LocalDate.now().plusDays(70);

		JsonNode response = postJson("/v1/bookings", Map.of(
				"roomId", gardenRoomId(),
				"checkIn", arrival.toString(),
				"checkOut", arrival.minusDays(2).toString(),
				"guests", 2), token);

		assertThat(response.path("success").asBoolean()).isFalse();
	}

	@Test
	void arrivalDatesInThePastAreRefused() throws Exception {
		String token = registerAndVerify(uniqueEmail("past"), "SuperSecret123");

		JsonNode response = postJson("/v1/bookings",
				stay(gardenRoomId(), LocalDate.now().minusDays(5), 2, 2), token);

		assertThat(response.path("success").asBoolean()).isFalse();
	}

	@Test
	void oneGuestCannotReadAnotherGuestsBooking() throws Exception {
		String owner = registerAndVerify(uniqueEmail("owner"), "SuperSecret123");
		String stranger = registerAndVerify(uniqueEmail("stranger"), "SuperSecret123");

		String reference = postJson("/v1/bookings",
				stay(gardenRoomId(), LocalDate.now().plusDays(90), 2, 2), owner)
				.path("data").path("reference").asText();

		mockMvc.perform(get("/v1/bookings/" + reference).header("Authorization", "Bearer " + stranger))
				.andExpect(status().isNotFound());

		mockMvc.perform(get("/v1/bookings/" + reference).header("Authorization", "Bearer " + owner))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.reference").value(reference));
	}

	@Test
	void bookingRequiresASignedInAccount() throws Exception {
		mockMvc.perform(post("/v1/bookings")
				.contentType(MediaType.APPLICATION_JSON)
				.content(json(stay(gardenRoomId(), LocalDate.now().plusDays(30), 2, 2))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void theFullBookingListIsForTheReservationsDeskOnly() throws Exception {
		String guest = registerAndVerify(uniqueEmail("nosy"), "SuperSecret123");

		mockMvc.perform(get("/v1/bookings").header("Authorization", "Bearer " + guest))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/v1/bookings").header("Authorization", "Bearer " + adminToken()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data").isArray());
	}

	@Test
	void theReservationsDeskCanConfirmABooking() throws Exception {
		String token = registerAndVerify(uniqueEmail("to-confirm"), "SuperSecret123");
		String reference = postJson("/v1/bookings",
				stay(gardenRoomId(), LocalDate.now().plusDays(150), 2, 2), token)
				.path("data").path("reference").asText();

		mockMvc.perform(patch("/v1/bookings/" + reference + "/status")
				.header("Authorization", "Bearer " + adminToken())
				.contentType(MediaType.APPLICATION_JSON)
				.content(json(Map.of("status", "CONFIRMED"))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.status").value("CONFIRMED"));
	}
}
