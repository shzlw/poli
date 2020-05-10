package com.shzlw.poli.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.dto.LoginResponse;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.Group;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.servlet.http.Cookie;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public abstract class AbstractWsTest {

    public static final String SAVEDQUERIES_BASE_URL = "/ws/saved-queries";
    public static final String CANNEDREPORTS_BASE_URL = "/ws/cannedreports";
    public static final String REPORTS_BASE_URL = "/ws/reports";
    public static final String USERS_BASE_URL = "/ws/users";
    public static final String GROUPS_BASE_URL = "/ws/groups";
    public static final String SHAREDREPORTS_BASE_URL = "/ws/sharedreports";
    public static final String COMPONENTS_BASE_URL = "/ws/components";
    public static final String JDBCDATASOURCES_BASE_URL = "/ws/jdbcdatasources";

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
                post("/ws/users")
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
                get("/ws/users/" + id)
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

    public long createReport(String name) throws Exception {
        Report newReport = new Report();
        newReport.setName(name);
        newReport.setStyle("{}");
        String body = mapper.writeValueAsString(newReport);

        mvcResult = mvc.perform(
                post("/ws/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        return id;
    }

    public long createComponent(long reportId) throws Exception {
        Component w1 = new Component();
        w1.setTitle("w1");
        w1.setX(1);
        w1.setY(2);
        w1.setWidth(3);
        w1.setHeight(4);
        w1.setType(Constants.COMPONENT_TYPE_CHART);
        w1.setSubType("table");
        w1.setReportId(reportId);
        w1.setData("{}");
        w1.setStyle("{}");
        w1.setDrillThrough("[]");

        String body = mapper.writeValueAsString(w1);

        mvcResult = mvc.perform(
                post("/ws/components")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        return id;
    }

    public Group createGroup(String groupName, List<Long> reportIds) throws Exception {
        Group g1 = new Group();
        g1.setName(groupName);
        g1.setGroupReports(reportIds);
        String body = mapper.writeValueAsString(g1);

        mvcResult = mvc.perform(
                post("/ws/groups")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        g1.setId(id);
        return g1;
    }

    public User createViewer(String username, List<Long> userGroups) throws Exception {
        User u1 = new User();
        u1.setUsername(username);
        u1.setName("n1");
        u1.setTempPassword("t1");
        u1.setUserGroups(userGroups);
        u1.setSysRole(Constants.SYS_ROLE_VIEWER);
        String body = mapper.writeValueAsString(u1);
        mvcResult = this.mvc.perform(
                post("/ws/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        u1.setId(id);
        return u1;
    }
}
