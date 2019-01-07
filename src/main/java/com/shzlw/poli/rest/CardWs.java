package com.shzlw.poli.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ws/card")
public class CardWs {

    /**
     * View board
     * 1. get 1 board
     * 2. init filters
     * 3. init cards
     * 4. run query for each card.
     * 5. filter changes.
     * 6. run query for each card with filter params
     *
     * Card id, filter params
     */
    public void runQuery() {

    }
}
