package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.dto.LoginResponse;
import com.shzlw.poli.filter.AuthFilter;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.Cookie;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public abstract class AbstractWsTest {

    @Autowired
    ObjectMapper mapper;

    @Autowired
    MockMvc mvc;

    MvcResult mvcResult;
    String responeText;
    Cookie[] cookies;
    User adminUser;

    public AbstractWsTest() {
        adminUser = new User();
        adminUser.setId(0);
        adminUser.setUsername("admin");
        adminUser.setSysRole(Constants.SYS_ROLE_ADMIN);
    }

    public User createNewUser(String sysRole) throws Exception {
        // Create a new User.
        String name = "name1";
        String username = "username1";
        String tempPassword = "tempPassword";

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setName(name);
        newUser.setTempPassword(tempPassword);
        newUser.setSysRole(sysRole);
        String body = mapper.writeValueAsString(newUser);

        mvcResult = this.mvc.perform(
                post("/ws/user")
                        .cookie(cookies)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                )
                .andExpect(status().isCreated())
                .andReturn();
        String id = mvcResult.getResponse().getContentAsString();
        long newId = Long.parseLong(id);

        mvcResult = this.mvc.perform(
                get("/ws/user/" + id)
                        .cookie(cookies)
        ).andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        User savedUser = mapper.readValue(responeText, User.class);
        Assert.assertEquals(newId, savedUser.getId());
        Assert.assertEquals(newUser.getUsername(), savedUser.getUsername());
        Assert.assertEquals(newUser.getName(), savedUser.getName());
        Assert.assertEquals(newUser.getSysRole(), savedUser.getSysRole());
        Assert.assertNull(savedUser.getPassword());
        Assert.assertNull(savedUser.getTempPassword());

        newUser.setId(newId);
        return newUser;
    }

    public LoginResponse loginFailure(String username, String password) throws Exception {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        mvcResult = mvc.perform(
                post("/auth/login/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(mapper.writeValueAsString(user))
                )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        LoginResponse loginResponse = mapper.readValue(responeText, LoginResponse.class);
        Assert.assertNotNull(loginResponse.getError());

        cookies = mvcResult.getResponse().getCookies();
        Assert.assertNull(cookies);

        return loginResponse;
    }

    public LoginResponse loginSuccess(String username, String password) throws Exception {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);

        mvcResult = mvc.perform(post("/auth/login/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(user)))
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        LoginResponse loginResponse = mapper.readValue(responeText, LoginResponse.class);
        Assert.assertEquals(loginResponse.getUsername(), username);
        Assert.assertNotNull(loginResponse.getSysRole());
        Assert.assertNull(loginResponse.getError());

        cookies = mvcResult.getResponse().getCookies();
        Assert.assertEquals(1, cookies.length);
        Assert.assertEquals(Constants.SESSION_KEY, cookies[0].getName());
        Assert.assertNotNull(Constants.SESSION_KEY, cookies[0].getValue());

        return loginResponse;
    }

    public LoginResponse loginAsAdmin() throws Exception {
        LoginResponse loginResponse = loginSuccess("admin", "adminadmin");
        Assert.assertFalse(loginResponse.isTempPassword());
        return loginResponse;
    }
}
