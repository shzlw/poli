package com.shzlw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import lombok.extern.slf4j.Slf4j;
@SpringBootApplication
//@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
@Slf4j
public class App {
    public static void main(String[] args) throws Exception {
    	log.info("##########$$$$$$$$$$$$$$$");
        SpringApplication.run(App.class, args);
    }
}