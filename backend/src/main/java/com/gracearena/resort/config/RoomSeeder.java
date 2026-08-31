package com.gracearena.resort.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.gracearena.resort.room.Room;
import com.gracearena.resort.room.RoomRepository;

/**
 * Seeds placeholder rooms so the frontend has something to render on first run.
 * Delete this once real data lands in a persistent database.
 */
@Component
public class RoomSeeder implements CommandLineRunner {

	private final RoomRepository roomRepository;

	public RoomSeeder(RoomRepository roomRepository) {
		this.roomRepository = roomRepository;
	}

	@Override
	public void run(String... args) {
		if (roomRepository.count() > 0) {
			return;
		}

		roomRepository.saveAll(List.of(
				Room.builder()
						.slug("garden-suite")
						.name("Garden Suite")
						.description("A ground-floor suite opening onto the resort gardens.")
						.pricePerNight(new BigDecimal("85000"))
						.capacity(2)
						.imageUrl("https://placehold.co/800x600?text=Garden+Suite")
						.available(true)
						.build(),
				Room.builder()
						.slug("arena-deluxe")
						.name("Arena Deluxe")
						.description("Spacious deluxe room overlooking the main arena.")
						.pricePerNight(new BigDecimal("120000"))
						.capacity(3)
						.imageUrl("https://placehold.co/800x600?text=Arena+Deluxe")
						.available(true)
						.build(),
				Room.builder()
						.slug("grace-executive")
						.name("Grace Executive")
						.description("Executive suite with a private lounge and workspace.")
						.pricePerNight(new BigDecimal("175000"))
						.capacity(4)
						.imageUrl("https://placehold.co/800x600?text=Grace+Executive")
						.available(true)
						.build(),
				Room.builder()
						.slug("presidential-villa")
						.name("Presidential Villa")
						.description("Standalone villa with a plunge pool and dedicated concierge.")
						.pricePerNight(new BigDecimal("320000"))
						.capacity(6)
						.imageUrl("https://placehold.co/800x600?text=Presidential+Villa")
						.available(false)
						.build()));
	}
}
