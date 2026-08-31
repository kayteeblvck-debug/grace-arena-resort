package com.gracearena.resort;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class GraceArenaResortApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
	}

	@Test
	void seededRoomsAreExposedOverTheApi() throws Exception {
		mockMvc.perform(get("/v1/rooms"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.success").value(true))
				.andExpect(jsonPath("$.data.length()").value(4));
	}

	@Test
	void availableOnlyFiltersOutUnavailableRooms() throws Exception {
		mockMvc.perform(get("/v1/rooms").param("availableOnly", "true"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.data.length()").value(3));
	}

	@Test
	void unknownRoomSlugReturnsNotFound() throws Exception {
		mockMvc.perform(get("/v1/rooms/does-not-exist"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.success").value(false));
	}
}
