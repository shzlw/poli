package com.shzlw.poli.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.servlet.http.Cookie;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public abstract class AbstractWsTest {

    @Autowired
    ObjectMapper mapper;

    @Autowired
    MockMvc mvc;

    MvcResult mvcResult;
    String responeText;

    public Cookie[] loginAsAdmin() throws Exception {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("adminadmin");

        mvcResult = mvc.perform(post("/auth/login/user")
                .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(admin)))
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Cookie[] cookies = mvcResult.getResponse().getCookies();
        return cookies;
    }
}
