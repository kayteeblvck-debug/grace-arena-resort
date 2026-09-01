package com.gracearena.resort.room;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A room type rather than a physical key: {@code totalUnits} is how many identical
 * rooms of this type exist, and availability is measured against that count.
 */
@Entity
@Table(name = "rooms")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String slug;

	@Column(nullable = false)
	private String name;

	/** One line under the name on cards and the detail hero. */
	@Column(length = 200)
	private String tagline;

	@Column(length = 1000)
	private String description;

	@Column(length = 4000)
	private String longDescription;

	@Column(nullable = false)
	private BigDecimal pricePerNight;

	@Column(nullable = false)
	private int capacity;

	private String bedType;

	/** Floor area in square metres. */
	private Integer sizeSqm;

	private String outlook;

	private String imageUrl;

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "room_gallery", joinColumns = @JoinColumn(name = "room_id"))
	@OrderColumn(name = "position")
	@Column(name = "image_url")
	@Builder.Default
	private List<String> gallery = new ArrayList<>();

	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "room_amenities", joinColumns = @JoinColumn(name = "room_id"))
	@OrderColumn(name = "position")
	@Column(name = "amenity")
	@Builder.Default
	private List<String> amenities = new ArrayList<>();

	/** How many rooms of this type the resort has. */
	@Column(nullable = false)
	@Builder.Default
	private int totalUnits = 1;

	/** Master switch — false takes the room type off sale entirely. */
	@Column(nullable = false)
	private boolean available;

	@Column(nullable = false)
	@Builder.Default
	private boolean featured = false;

	@Column(nullable = false)
	@Builder.Default
	private int sortOrder = 0;
}
