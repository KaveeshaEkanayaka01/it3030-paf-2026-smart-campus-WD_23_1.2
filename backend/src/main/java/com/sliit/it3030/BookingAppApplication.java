package com.sliit.it3030;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class BookingAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookingAppApplication.class, args);
    }
}
