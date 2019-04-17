package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.jdbc.support.JdbcUtils;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpSession;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class UserWsTest {

    @Autowired
    ObjectMapper mapper;

    @Autowired
    MockMvc mvc;

    MvcResult mvcResult;
    String responeText;

    @Test
    public void testLogin() throws Exception {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("adminadmin");

        mvcResult = this.mvc.perform(post("/auth/login/user")
                .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(admin)))
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Cookie[] cookies = mvcResult.getResponse().getCookies();
    }

    @Test
    public void test() throws Exception {
        // Login as Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword("adminadmin");

        mvcResult = this.mvc.perform(post("/auth/login/user")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(admin))
                ).andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Cookie[] cookies = mvcResult.getResponse().getCookies();

        String name = "name1";
        String username = "username1";
        String tempPassword = "tempPassword";
        String sysRole = Constants.SYS_ROLE_DEVELOPER;

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setName(name);
        newUser.setTempPassword(tempPassword);
        newUser.setSysRole(sysRole);
        String body = mapper.writeValueAsString(newUser);

        // Create a new User.
        mvcResult = this.mvc.perform(
                post("/ws/user")
                .cookie(cookies)
                .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated()
                ).andReturn();
        String id = mvcResult.getResponse().getContentAsString();

        mvcResult = this.mvc.perform(
                get("/ws/user")
                .cookie(cookies)
                ).andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<User> users = mapper.readValue(responeText, new TypeReference<List<User>>(){});
        User savedUser = users.get(0);
        Assert.assertEquals(Long.parseLong(id), savedUser.getId());
        Assert.assertEquals(newUser.getUsername(), savedUser.getUsername());
        Assert.assertEquals(newUser.getName(), savedUser.getName());
        Assert.assertEquals(newUser.getSysRole(), savedUser.getSysRole());
        Assert.assertNull(savedUser.getPassword());
        Assert.assertNull(savedUser.getTempPassword());
    }
}
