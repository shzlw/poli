package com.shzlw.poli.rest;

import com.shzlw.poli.config.AppProperties;
import com.shzlw.poli.dto.AppInfo;
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

    @RequestMapping(value="/general", method = RequestMethod.GET)
    public AppInfo getGeneral() {
        return new AppInfo(Constants.CURRENT_VERSION, appProperties.getLocaleLanguage());
    }
}
