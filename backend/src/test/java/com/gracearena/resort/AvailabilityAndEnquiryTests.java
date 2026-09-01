package com.gracearena.resort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Map;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.databind.JsonNode;
import com.gracearena.resort.room.RoomRepository;

class AvailabilityAndEnquiryTests extends ApiTestSupport {

	@Autowired
	private RoomRepository roomRepository;

	private JsonNode searchAvailability(LocalDate from, int nights, int guests) throws Exception {
		String response = mockMvc.perform(get("/v1/availability")
				.param("checkIn", from.toString())
				.param("checkOut", from.plusDays(nights).toString())
				.param("guests", String.valueOf(guests)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		return objectMapper.readTree(response).path("data");
	}

	@Test
	void availabilityIsOpenToAnyoneAndPricesTheWholeStay() throws Exception {
		JsonNode results = searchAvailability(LocalDate.now().plusDays(400), 2, 2);

		assertThat(results).isNotEmpty();
		JsonNode first = results.get(0);
		assertThat(first.path("nights").asInt()).isEqualTo(2);
		assertThat(first.path("totalAmount").asDouble())
				.isEqualTo(first.path("room").path("pricePerNight").asDouble() * 2);
		assertThat(first.path("bookable").asBoolean()).isTrue();
	}

	@Test
	void aRoomTooSmallForThePartyIsReturnedButNotBookable() throws Exception {
		JsonNode results = searchAvailability(LocalDate.now().plusDays(410), 1, 6);

		JsonNode gardenRoom = null;
		for (JsonNode entry : results) {
			if ("itura-garden-room".equals(entry.path("room").path("slug").asText())) {
				gardenRoom = entry;
			}
		}

		assertThat(gardenRoom).isNotNull();
		assertThat(gardenRoom.path("bookable").asBoolean()).isFalse();
		assertThat(gardenRoom.path("reason").asText()).contains("Sleeps up to 2");
	}

	@Test
	void aSoldOutTypeReportsNoUnitsLeft() throws Exception {
		String token = registerAndVerify(uniqueEmail("availability"), "SuperSecret123");
		LocalDate arrival = LocalDate.now().plusDays(500);
		Long villaId = roomRepository.findBySlug("grace-presidential-villa").orElseThrow().getId();

		postJson("/v1/bookings", Map.of(
				"roomId", villaId,
				"checkIn", arrival.toString(),
				"checkOut", arrival.plusDays(3).toString(),
				"guests", 2), token);

		JsonNode results = searchAvailability(arrival, 3, 2);

		JsonNode villa = null;
		for (JsonNode entry : results) {
			if ("grace-presidential-villa".equals(entry.path("room").path("slug").asText())) {
				villa = entry;
			}
		}

		assertThat(villa).isNotNull();
		assertThat(villa.path("unitsLeft").asInt()).isZero();
		assertThat(villa.path("bookable").asBoolean()).isFalse();
		assertThat(villa.path("reason").asText()).contains("Fully booked");
	}

	@Test
	void searchingBackwardsDatesIsRejected() throws Exception {
		LocalDate arrival = LocalDate.now().plusDays(30);

		mockMvc.perform(get("/v1/availability")
				.param("checkIn", arrival.toString())
				.param("checkOut", arrival.minusDays(1).toString()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void aMissingDateGivesAReadableError() throws Exception {
		mockMvc.perform(get("/v1/availability").param("checkIn", LocalDate.now().toString()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value(Matchers.containsString("checkOut")));
	}

	@Test
	void anyoneCanSendAnEventEnquiry() throws Exception {
		JsonNode response = postJson("/v1/enquiries", Map.of(
				"name", "Adebayo Familusi",
				"email", "adebayo@example.test",
				"phone", "+234 803 000 0000",
				"type", "WEDDING",
				"preferredDate", LocalDate.now().plusMonths(8).toString(),
				"expectedGuests", 350,
				"message", "We would like to hold our reception at the Arena."), null);

		assertThat(response.path("success").asBoolean()).isTrue();
		assertThat(response.path("data").path("reference").asText()).startsWith("GAE-");
	}

	@Test
	void enquiriesRequireAMessageAndAValidAddress() throws Exception {
		JsonNode response = postJson("/v1/enquiries", Map.of(
				"name", "No Message",
				"email", "not-an-email",
				"type", "GENERAL",
				"message", ""), null);

		assertThat(response.path("success").asBoolean()).isFalse();
	}

	@Test
	void readingEnquiriesIsForTheReservationsDeskOnly() throws Exception {
		String guest = registerAndVerify(uniqueEmail("enquiry-reader"), "SuperSecret123");

		mockMvc.perform(get("/v1/enquiries").header("Authorization", "Bearer " + guest))
				.andExpect(status().isForbidden());

		mockMvc.perform(get("/v1/enquiries").header("Authorization", "Bearer " + adminToken()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data").isArray());
	}
}
