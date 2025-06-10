package com.kma.shop.config;

import com.github.javafaker.Faker;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Locale;

@Configuration
public class FakerConfig {

    @Bean
    public Faker faker() {
        return new Faker(new Locale("vi")); // hoặc "en-US"
    }
}