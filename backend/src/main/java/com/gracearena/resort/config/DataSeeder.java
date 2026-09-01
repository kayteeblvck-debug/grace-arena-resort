package com.gracearena.resort.config;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.gracearena.resort.room.Room;
import com.gracearena.resort.room.RoomRepository;
import com.gracearena.resort.user.Role;
import com.gracearena.resort.user.User;
import com.gracearena.resort.user.UserRepository;

/**
 * Fills the in-memory database on startup so the site has something to show.
 *
 * Room copy here is real, usable placeholder content — rates, unit counts and
 * photography still need to be confirmed with the resort before launch. Replace this
 * with proper migrations and an admin CMS once there is a persistent database.
 */
@Component
public class DataSeeder implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

	private final RoomRepository roomRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final boolean seedDemoAccounts;
	private final String adminEmail;
	private final String adminPassword;

	public DataSeeder(RoomRepository roomRepository, UserRepository userRepository, PasswordEncoder passwordEncoder,
			@Value("${app.seed.demo-accounts:true}") boolean seedDemoAccounts,
			@Value("${app.seed.admin-email:admin@gracearenaresort.com}") String adminEmail,
			@Value("${app.seed.admin-password:GraceArena!2026}") String adminPassword) {
		this.roomRepository = roomRepository;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.seedDemoAccounts = seedDemoAccounts;
		this.adminEmail = adminEmail;
		this.adminPassword = adminPassword;
	}

	@Override
	public void run(String... args) {
		seedRooms();
		seedAccounts();
	}

	private void seedRooms() {
		if (roomRepository.count() > 0) {
			return;
		}

		roomRepository.saveAll(List.of(
				Room.builder()
						.slug("itura-garden-room")
						.name("Ìtùra Garden Room")
						.tagline("Ground-floor calm, opening onto the lawns")
						.description("A serene ground-floor room that opens through full-height doors onto the "
								+ "resort's lawns and frangipani beds.")
						.longDescription("""
								Ìtùra means ease, and this room is named for the way the morning arrives in it. \
								Full-height doors give onto a private stretch of the lawns, so the first thing \
								you see is green. Inside, the palette is warm — raw silk in oyster and gold, a \
								hand-carved Ìbàdàn headboard, àdìrè cushions from a workshop two towns over.

								The bathroom is finished in honed local granite with a walk-in rain shower. \
								Breakfast can be laid on the terrace, or brought to you in bed; the choice is \
								made the night before with your floor host.""")
						.pricePerNight(new BigDecimal("85000"))
						.capacity(2)
						.bedType("One king or two twins")
						.sizeSqm(38)
						.outlook("Garden and lawns")
						.imageUrl("/images/rooms/itura-garden-room.jpg")
						.gallery(List.of(
								"/images/rooms/itura-garden-room.jpg",
								"/images/rooms/itura-garden-room-bath.jpg",
								"/images/rooms/itura-garden-room-terrace.jpg"))
						.amenities(List.of("Private garden terrace", "King or twin beds", "Rain shower",
								"Air conditioning", "Smart TV", "Complimentary Wi-Fi", "In-room safe",
								"Tea and coffee service", "Daily housekeeping"))
						.totalUnits(12)
						.available(true)
						.featured(false)
						.sortOrder(10)
						.build(),

				Room.builder()
						.slug("ibarapa-deluxe")
						.name("Ìbàrapa Deluxe")
						.tagline("A generous room with a writing desk and a long view")
						.description("Our most-booked room: generous, quiet, and set high enough to look out "
								+ "across the compound to the Ibarapa treeline.")
						.longDescription("""
								The Deluxe rooms sit on the upper floor of the main house, where the windows are \
								tall and the noise of the day never quite reaches. Each has a proper writing desk \
								— a real one, not a shelf — and a reading chair placed where the afternoon light \
								lands.

								Fabrics are woven aṣọ-òkè in indigo and bronze. The bathroom has a double vanity \
								and a deep soaking tub as well as the shower. It is the room we put people in \
								when they are staying more than two nights.""")
						.pricePerNight(new BigDecimal("120000"))
						.capacity(3)
						.bedType("One king, sofa bed available")
						.sizeSqm(46)
						.outlook("Compound and treeline")
						.imageUrl("/images/rooms/ibarapa-deluxe.jpg")
						.gallery(List.of(
								"/images/rooms/ibarapa-deluxe.jpg",
								"/images/rooms/ibarapa-deluxe-bath.jpg",
								"/images/rooms/ibarapa-deluxe-desk.jpg"))
						.amenities(List.of("Elevated outlook", "Writing desk", "Soaking tub and rain shower",
								"Double vanity", "Air conditioning", "Smart TV", "Complimentary Wi-Fi",
								"Mini bar", "In-room safe", "Nespresso machine", "Twice-daily housekeeping"))
						.totalUnits(8)
						.available(true)
						.featured(true)
						.sortOrder(20)
						.build(),

				Room.builder()
						.slug("arena-terrace-suite")
						.name("Arena Terrace Suite")
						.tagline("A suite above the Arena, with a terrace made for evenings")
						.description("A one-bedroom suite with a private wraparound terrace overlooking the "
								+ "Arena lawn — the best seat in the resort when there is an event on.")
						.longDescription("""
								When the Arena is lit for a wedding, this is where you want to be standing. The \
								terrace wraps two sides of the suite and takes a table for six comfortably, with \
								loungers at the far end for the quiet hours.

								Indoors, the bedroom and sitting room are separate, so one of you can sleep while \
								the other works or watches. A bronze-framed dressing area sits between the two. \
								The bar is stocked to your list, sent ahead of arrival.""")
						.pricePerNight(new BigDecimal("185000"))
						.capacity(3)
						.bedType("One king, separate sitting room")
						.sizeSqm(64)
						.outlook("Arena lawn and gardens")
						.imageUrl("/images/rooms/arena-terrace-suite.jpg")
						.gallery(List.of(
								"/images/rooms/arena-terrace-suite.jpg",
								"/images/rooms/arena-terrace-suite-lounge.jpg",
								"/images/rooms/arena-terrace-suite-terrace.jpg"))
						.amenities(List.of("Private wraparound terrace", "Separate sitting room", "Dressing area",
								"Soaking tub and rain shower", "Stocked bar to your list", "Air conditioning",
								"Two smart TVs", "Complimentary Wi-Fi", "In-room safe", "Nespresso machine",
								"Evening turndown"))
						.totalUnits(6)
						.available(true)
						.featured(true)
						.sortOrder(30)
						.build(),

				Room.builder()
						.slug("ola-executive-suite")
						.name("Ọlá Executive Suite")
						.tagline("For the guest who is here to work, and to be looked after")
						.description("A two-room suite with a private study, a meeting table for four, and "
								+ "direct service from the concierge desk.")
						.longDescription("""
								Ọlá is honour. This suite was designed around the guest who arrives with a full \
								diary: a study that closes with a real door, a meeting table that seats four, \
								printing and scanning handled by the desk downstairs, and a car on call.

								The bedroom is deliberately the opposite — dark, cool, and quiet, with blackout \
								linen and a bed dressed in Egyptian cotton. There is a rain shower and a separate \
								tub, and a dressing room with room for a fortnight's luggage.""")
						.pricePerNight(new BigDecimal("245000"))
						.capacity(4)
						.bedType("One king plus convertible study sofa")
						.sizeSqm(82)
						.outlook("Gardens and pool")
						.imageUrl("/images/rooms/ola-executive-suite.jpg")
						.gallery(List.of(
								"/images/rooms/ola-executive-suite.jpg",
								"/images/rooms/ola-executive-suite-study.jpg",
								"/images/rooms/ola-executive-suite-bath.jpg"))
						.amenities(List.of("Private study with meeting table", "Dressing room", "Separate tub and shower",
								"Blackout linen", "Dedicated concierge line", "Airport and Ibadan transfers",
								"Air conditioning", "Three smart TVs", "Complimentary Wi-Fi", "In-room safe",
								"Stocked bar", "Evening turndown", "Daily pressing"))
						.totalUnits(4)
						.available(true)
						.featured(false)
						.sortOrder(40)
						.build(),

				Room.builder()
						.slug("twin-city-pool-villa")
						.name("Twin City Pool Villa")
						.tagline("Two bedrooms, one plunge pool, and a wall around all of it")
						.description("A walled two-bedroom villa with its own plunge pool and outdoor dining "
								+ "pavilion — named for Igbo-Ora, the twin capital of the world.")
						.longDescription("""
								Igbo-Ora is known the world over for its twins, and the villa takes its name and \
								its plan from that: two equal bedroom wings either side of a shared living \
								pavilion, each with its own bathroom and its own door to the garden.

								Between them is the part everyone remembers — a walled courtyard with a plunge \
								pool, a dining pavilion under a timber canopy, and an outdoor shower screened by \
								bamboo. A chef can be assigned to the villa for the length of your stay.""")
						.pricePerNight(new BigDecimal("380000"))
						.capacity(5)
						.bedType("Two kings, one sofa bed")
						.sizeSqm(140)
						.outlook("Private walled courtyard")
						.imageUrl("/images/rooms/twin-city-pool-villa.jpg")
						.gallery(List.of(
								"/images/rooms/twin-city-pool-villa.jpg",
								"/images/rooms/twin-city-pool-villa-pool.jpg",
								"/images/rooms/twin-city-pool-villa-pavilion.jpg"))
						.amenities(List.of("Private plunge pool", "Walled courtyard", "Outdoor dining pavilion",
								"Outdoor shower", "Two en-suite bedrooms", "Chef on request", "Butler service",
								"Air conditioning throughout", "Complimentary Wi-Fi", "Stocked bar",
								"Airport and Ibadan transfers"))
						.totalUnits(3)
						.available(true)
						.featured(true)
						.sortOrder(50)
						.build(),

				Room.builder()
						.slug("grace-presidential-villa")
						.name("Grace Presidential Villa")
						.tagline("The whole of the north lawn, and a team who answer only to you")
						.description("Our largest residence: three bedrooms, a private cook, a driver, and a "
								+ "gated entrance of its own.")
						.longDescription("""
								The Presidential Villa sits alone at the north end of the estate behind its own \
								gate, with parking for four cars and an entrance that never touches the main \
								drive. Three bedroom suites open onto a colonnaded veranda; the living room seats \
								fourteen and has been used for everything from family Christmases to signings.

								A cook, a housekeeper and a driver are assigned to the villa for your stay. The \
								dining room seats twelve and the kitchen is a working one — if you would rather \
								your own chef came with you, they are welcome to it.""")
						.pricePerNight(new BigDecimal("650000"))
						.capacity(6)
						.bedType("Three king suites")
						.sizeSqm(320)
						.outlook("Private north lawn")
						.imageUrl("/images/rooms/grace-presidential-villa.jpg")
						.gallery(List.of(
								"/images/rooms/grace-presidential-villa.jpg",
								"/images/rooms/grace-presidential-villa-living.jpg",
								"/images/rooms/grace-presidential-villa-dining.jpg"))
						.amenities(List.of("Private gated entrance", "Three en-suite bedrooms", "Living room for 14",
								"Dining room for 12", "Working kitchen", "Assigned cook and housekeeper",
								"Assigned driver", "Private pool", "Colonnaded veranda", "Parking for four cars",
								"Complimentary Wi-Fi", "Full board available"))
						.totalUnits(1)
						.available(true)
						.featured(false)
						.sortOrder(60)
						.build()));

		log.info("Seeded {} room types", roomRepository.count());
	}

	private void seedAccounts() {
		if (!seedDemoAccounts || userRepository.count() > 0) {
			return;
		}

		userRepository.save(User.builder()
				.firstName("Reservations")
				.lastName("Desk")
				.email(adminEmail.toLowerCase())
				.phone("+234 800 000 0000")
				.passwordHash(passwordEncoder.encode(adminPassword))
				.role(Role.ADMIN)
				.emailVerified(true)
				.emailVerifiedAt(Instant.now())
				.createdAt(Instant.now())
				.build());

		log.warn("""

				──────────────── SEEDED ADMIN ACCOUNT (development) ────────────────
				  {}  /  {}
				  Set app.seed.demo-accounts=false, or APP_SEED_ADMIN_PASSWORD,
				  before pointing this at a database that outlives a restart.
				────────────────────────────────────────────────────────────────────
				""", adminEmail, adminPassword);
	}
}
