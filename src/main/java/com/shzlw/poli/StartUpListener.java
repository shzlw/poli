package com.shzlw.poli;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class StartUpListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(StartUpListener.class);

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEvent () {
        LOGGER.info("[poli] starts up...");
    }
}