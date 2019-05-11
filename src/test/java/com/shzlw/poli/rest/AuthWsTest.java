package com.shzlw.poli.rest;

import com.shzlw.poli.dto.LoginResponse;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class AuthWsTest extends AbstractWsTest {

    @Test
    public void testLoginAsAdmin() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
    }

    @Test
    public void testLoginWithCookie() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
        mvcResult = this.mvc.perform(
                post("/auth/login/cookie").cookie(cookies))
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        loginResponse = mapper.readValue(responeText, LoginResponse.class);
        Assert.assertNotNull(loginResponse.getUsername());
        Assert.assertNotNull(loginResponse.getSysRole());
        Assert.assertNull(loginResponse.getError());
    }

    @Test
    public void testLogout() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
        mvcResult = this.mvc.perform(
                get("/auth/logout")
                        .cookie(cookies))
                .andExpect(status().isOk())
                .andReturn();
        cookies = mvcResult.getResponse().getCookies();
        Assert.assertEquals(1, cookies.length);
        Assert.assertEquals(Constants.SESSION_KEY, cookies[0].getName());
        Assert.assertEquals(0, cookies[0].getMaxAge());
    }

    @Test
    public void testChangeTempPassowrd_success() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
        User user = createNewUser("username1", Constants.SYS_ROLE_VIEWER);
        loginResponse = loginSuccess(user.getUsername(), user.getTempPassword());
        Assert.assertTrue(loginResponse.isTempPassword());

        String newPassword = "12345678";
        User changePasswordRequest = new User();
        changePasswordRequest.setPassword(newPassword);

        mvcResult = this.mvc.perform(
                post("/auth/login/change-password")
                        .cookie(cookies)
                        .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(changePasswordRequest)))
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(0, responeText.length());

        loginResponse = loginSuccess(user.getUsername(), newPassword);
        Assert.assertFalse(loginResponse.isTempPassword());
    }

    @Test
    public void testChangeTempPassowrd_moreCharacters() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
        User user = createNewUser("username1", Constants.SYS_ROLE_VIEWER);
        loginResponse = loginSuccess(user.getUsername(), user.getTempPassword());
        Assert.assertTrue(loginResponse.isTempPassword());

        String newPassword = "1234567";
        User changePasswordRequest = new User();
        changePasswordRequest.setPassword(newPassword);

        mvcResult = this.mvc.perform(
                post("/auth/login/change-password")
                        .cookie(cookies)
                        .contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsString(changePasswordRequest)))
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        loginResponse = mapper.readValue(responeText, LoginResponse.class);
        Assert.assertEquals(AuthWs.USE_MORE_CHARACTERS, loginResponse.getError());
    }

    @Test
    public void testGenerateApiKey() throws Exception {
        LoginResponse loginResponse = loginAsAdmin();
        mvcResult = this.mvc.perform(
                get("/auth/generate-apikey").cookie(cookies))
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertTrue(responeText.startsWith(Constants.API_KEY_PREFIX));
    }
}
