package com.shzlw.poleo.rest;

import com.shzlw.poleo.util.Constants;
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

    @Test
    public void testGetVersion() throws Exception {
        MvcResult mvcResult = mvc.perform(get("/info/version")).andExpect(status().isOk())
                .andReturn();
        String responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(Constants.CURRENT_VERSION, responeText);
    }
}
