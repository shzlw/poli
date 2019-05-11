package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.dto.LoginResponse;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.model.Widget;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.servlet.http.Cookie;

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

    public User createNewUser(String username, String sysRole) throws Exception {
        // Create a new User.
        String name = "name1";
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

    public long createDashboard(String name) throws Exception {
        Dashboard newDashboard = new Dashboard();
        newDashboard.setName(name);
        newDashboard.setStyle("{}");
        String body = mapper.writeValueAsString(newDashboard);

        mvcResult = mvc.perform(
                post("/ws/dashboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        return id;
    }

    public long createWidget(long dashboardId) throws Exception {
        Widget w1 = new Widget();
        w1.setTitle("w1");
        w1.setX(1);
        w1.setY(2);
        w1.setWidth(3);
        w1.setHeight(4);
        w1.setType(Constants.WIDGET_TYPE_CHART);
        w1.setChartType("table");
        w1.setDashboardId(dashboardId);
        w1.setData("{}");
        w1.setStyle("{}");
        w1.setDrillThrough("[]");

        String body = mapper.writeValueAsString(w1);

        mvcResult = mvc.perform(
                post("/ws/widget")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        return id;
    }
}
