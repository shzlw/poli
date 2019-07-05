package com.shzlw.poli.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.AppProperties;
import com.shzlw.poli.dto.AppInfo;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
public class InfoWsTest {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper mapper;

    @Autowired
    AppProperties appProperties;

    @Test
    public void testGetAppInfo() throws Exception {
        MvcResult mvcResult = mvc.perform(get("/info/general")).andExpect(status().isOk())
                .andReturn();
        String responeText = mvcResult.getResponse().getContentAsString();
        AppInfo appInfo = mapper.readValue(responeText, AppInfo.class);

        Assert.assertEquals(Constants.CURRENT_VERSION, appInfo.getVersion());
        Assert.assertEquals(appProperties.getLocaleLanguage(), appInfo.getLocaleLanguage());
    }
}
