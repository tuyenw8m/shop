package com.kma.shop.controller;

import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.crypto.Data;

@RestController
@RequestMapping
public class FakerController {
    @Autowired
    private final DataSeeder dataSeeder;


    public FakerController(DataSeeder dataSeeder) {
        this.dataSeeder = dataSeeder;
    }

    @PostMapping("/faker/user")
    public boolean fakerUser() throws Exception {
        dataSeeder.run();
        dataSeeder.product();
        return true;
    }
}
