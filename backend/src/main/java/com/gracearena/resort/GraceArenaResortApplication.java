package com.gracearena.resort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GraceArenaResortApplication {

	public static void main(String[] args) {
		SpringApplication.run(GraceArenaResortApplication.class, args);
	}
}
