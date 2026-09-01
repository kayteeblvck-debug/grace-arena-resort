package com.gracearena.resort;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;

/** The public catalogue: readable by anyone, no token required. */
class GraceArenaResortApplicationTests extends ApiTestSupport {

	@Test
	void contextLoads() {
	}

	@Test
	void seededRoomsAreExposedOverTheApi() throws Exception {
		mockMvc.perform(get("/v1/rooms"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.length()").value(Matchers.greaterThan(0)))
				.andExpect(jsonPath("$.data[0].slug").isNotEmpty())
				.andExpect(jsonPath("$.data[0].amenities").isArray());
	}

	@Test
	void roomsCanBeFetchedBySlugWithTheirGallery() throws Exception {
		mockMvc.perform(get("/v1/rooms/twin-city-pool-villa"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.name").value("Twin City Pool Villa"))
				.andExpect(jsonPath("$.data.gallery.length()").value(Matchers.greaterThan(0)))
				.andExpect(jsonPath("$.data.capacity").value(5));
	}

	@Test
	void availableOnlyReturnsOnlyRoomsOnSale() throws Exception {
		mockMvc.perform(get("/v1/rooms").param("availableOnly", "true"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data[*].available", Matchers.everyItem(Matchers.is(true))));
	}

	@Test
	void unknownRoomSlugReturnsNotFound() throws Exception {
		mockMvc.perform(get("/v1/rooms/does-not-exist"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.success").value(false));
	}

	@Test
	void healthIsOpen() throws Exception {
		mockMvc.perform(get("/v1/health")).andExpect(status().isOk());
	}
}
