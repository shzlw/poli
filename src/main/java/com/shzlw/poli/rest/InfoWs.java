package com.shzlw.poli.rest;

import com.shzlw.poli.AppProperties;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/info")
public class InfoWs {

    @Autowired
    AppProperties appProperties;

    @RequestMapping(value="/version", method = RequestMethod.GET)
    public String getVersion() {
        return Constants.CURRENT_VERSION;
    }

    @RequestMapping(value="/locale", method = RequestMethod.GET)
    public String getLocaleLanguage() {
        return appProperties.getLocaleLanguage();
    }
}
