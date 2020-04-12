package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.JdbcDataSource;
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
public class JdbcDataSourceWsTest extends AbstractWsTest {

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Test
    public void test() throws Exception {
        // ********** Create **********
        JdbcDataSource j1 = new JdbcDataSource();
        j1.setName("j1");
        j1.setConnectionUrl("c1");
        j1.setDriverClassName("d1");
        j1.setUsername("u1");
        j1.setPassword("p1");
        j1.setPing("p1");

        String body = mapper.writeValueAsString(j1);
        mvcResult = mvc.perform(
                post(JDBCDATASOURCES_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());
        // Verify one
        responeText = findJdbcDataSource(id);
        JdbcDataSource saved = mapper.readValue(responeText, JdbcDataSource.class);
        assertJdbcDataSource(j1, saved);

        // Verify the list
        mvcResult = mvc.perform(
                get(JDBCDATASOURCES_BASE_URL)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<JdbcDataSource> jdbcDataSources = mapper.readValue(responeText, new TypeReference<List<JdbcDataSource>>() {});
        Assert.assertEquals(1, jdbcDataSources.size());
        saved = jdbcDataSources.get(0);
        assertJdbcDataSource(j1, saved);

        // ********** Update information only **********
        j1.setId(id);
        j1.setName("j2");
        j1.setConnectionUrl("c2");
        j1.setDriverClassName("d2");
        j1.setUsername("u2");
        j1.setPing("p2");
        body = mapper.writeValueAsString(j1);
        mvcResult = mvc.perform(
                put(JDBCDATASOURCES_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findJdbcDataSource(id);
        saved = mapper.readValue(responeText, JdbcDataSource.class);
        assertJdbcDataSource(j1, saved);

        // ********** Update password **********
        j1.setId(id);
        j1.setPassword("p3");
        body = mapper.writeValueAsString(j1);
        mvcResult = mvc.perform(
                put(JDBCDATASOURCES_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        saved = jdbcDataSourceDao.findById(id);
        Assert.assertEquals(saved.getPassword(), j1.getPassword());

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete(JDBCDATASOURCES_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findJdbcDataSource(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private String findJdbcDataSource(long id) throws Exception {
        mvcResult = mvc.perform(
                get(JDBCDATASOURCES_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }

    private void assertJdbcDataSource(JdbcDataSource expected, JdbcDataSource target) {
        Assert.assertEquals(expected.getName(), target.getName());
        Assert.assertEquals(expected.getConnectionUrl(), target.getConnectionUrl());
        Assert.assertEquals(expected.getDriverClassName(), target.getDriverClassName());
        Assert.assertEquals(expected.getUsername(), target.getUsername());
        Assert.assertEquals(expected.getPing(), target.getPing());
        Assert.assertNull(target.getPassword());
    }
}
