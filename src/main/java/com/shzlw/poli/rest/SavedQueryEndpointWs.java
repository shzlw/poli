package com.shzlw.poli.rest;

import com.shzlw.poli.model.SavedQuery;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/saved-query")
public class SavedQueryEndpointWs {

    @RequestMapping(method = RequestMethod.GET)
    @Transactional(readOnly = true)
    public ResponseEntity<String> test(@RequestParam("name") String name,
                                       @RequestParam(name = "accessCode", required = false, defaultValue = "") String accessCode,
                                       @RequestParam(name = "contentType", required = false, defaultValue = "") String contentType) {

        if (SavedQuery.CONTENT_TYPE_CSV.equals(contentType)) {

        } else {
            // Return JSON format
        }

        String responseBody = "test";

        return new ResponseEntity<>(responseBody, HttpStatus.OK);
    }
}
