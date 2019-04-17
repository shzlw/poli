package com.shzlw.poli.rest;

import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class AuthWsTest extends AbstractWsTest {

    @Test
    public void testLogin() throws Exception {
        Cookie[] cookies = loginAsAdmin();
        Assert.assertEquals(1, cookies.length);
        Assert.assertEquals(Constants.SESSION_KEY, cookies[0].getName());
        Assert.assertNotNull(Constants.SESSION_KEY, cookies[0].getValue());
    }
}
