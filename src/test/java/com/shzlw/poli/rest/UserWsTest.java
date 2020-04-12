package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class UserWsTest extends AbstractWsTest {

    @Autowired
    UserDao userDao;

    @Test
    public void test() throws Exception {
        // ********** Create **********
        User u1 = new User();
        u1.setUsername("u1");
        u1.setName("n1");
        u1.setTempPassword("t1");
        u1.setSysRole(Constants.SYS_ROLE_VIEWER);
        String body = mapper.writeValueAsString(u1);
        mvcResult = this.mvc.perform(
                post(USERS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        u1.setId(id);

        User saved = findUser(id);
        assertUser(u1, saved);

        // Verify the list
        mvcResult = this.mvc.perform(
                get(USERS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<User> users = mapper.readValue(responeText, new TypeReference<List<User>>() {});
        Assert.assertEquals(1, users.size());
        saved = users.get(0);
        assertUser(u1, saved);

        // ********** Update information **********
        u1.setId(id);
        u1.setUsername("u2");
        u1.setName("n2");
        u1.setSysRole(Constants.SYS_ROLE_DEVELOPER);
        body = mapper.writeValueAsString(u1);
        mvcResult = mvc.perform(
                put(USERS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        saved = findUser(id);
        assertUser(u1, saved);

        // ********** Update password **********
        u1.setTempPassword("newTempPassword");
        body = mapper.writeValueAsString(u1);
        mvcResult = mvc.perform(
                put(USERS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        saved = userDao.findByUsernameAndTempPassword(u1.getUsername(), u1.getTempPassword());
        assertUser(u1, saved);

        // ********** Update account **********
        u1.setName("n3");
        u1.setTempPassword(null);
        body = mapper.writeValueAsString(u1);
        mvcResult = mvc.perform(
                put(USERS_BASE_URL + "/account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, u1)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();

        // ********** Verify account **********
        mvcResult = mvc.perform(
                get(USERS_BASE_URL + "/account")
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, u1)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        saved = mapper.readValue(responeText, User.class);
        assertUser(u1, saved);

        // ********** Update account with new password **********
        u1.setName("n4");
        u1.setPassword("newPassword");
        body = mapper.writeValueAsString(u1);
        mvcResult = mvc.perform(
                put(USERS_BASE_URL + "/account")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, u1)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        saved = userDao.findByUsernameAndPassword(u1.getUsername(), u1.getPassword());
        assertUser(u1, saved);

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete(USERS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        mvcResult = mvc.perform(
                get(USERS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private User findUser(long id) throws Exception {
        mvcResult = mvc.perform(
                get(USERS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        User user = mapper.readValue(responeText, User.class);
        return user;
    }

    private void assertUser(User expected, User target) {
        Assert.assertEquals(expected.getId(), target.getId());
        Assert.assertEquals(expected.getUsername(), target.getUsername());
        Assert.assertEquals(expected.getName(), target.getName());
        Assert.assertEquals(expected.getSysRole(), target.getSysRole());
        Assert.assertNull(target.getPassword());
        Assert.assertNull(target.getTempPassword());
    }
}
