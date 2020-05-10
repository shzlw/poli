package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.SavedQuery;
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
public class SavedQueryWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // ********** Create **********
        SavedQuery newQuery = new SavedQuery();
        newQuery.setName("q1");
        newQuery.setSqlQuery("query");
        newQuery.setJdbcDataSourceId(1);
        newQuery.setEndpointName("endpointName");
        newQuery.setEndpointAccessCode("endpointAccessCode");
        String body = mapper.writeValueAsString(newQuery);

        mvcResult = mvc.perform(
                post(SAVEDQUERIES_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());

        // Verify one
        responeText = findSavedQuery(id);
        SavedQuery saved = mapper.readValue(responeText, SavedQuery.class);
        Assert.assertEquals(newQuery.getName(), saved.getName());
        Assert.assertEquals(newQuery.getSqlQuery(), saved.getSqlQuery());
        Assert.assertEquals(newQuery.getJdbcDataSourceId(), saved.getJdbcDataSourceId());
        Assert.assertEquals(newQuery.getEndpointName(), saved.getEndpointName());
        Assert.assertEquals(newQuery.getEndpointAccessCode(), saved.getEndpointAccessCode());

        // Verify the list
        mvcResult = mvc.perform(
                get(SAVEDQUERIES_BASE_URL)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<SavedQuery> savedQueryList = mapper.readValue(responeText, new TypeReference<List<SavedQuery>>() {});
        Assert.assertEquals(1, savedQueryList.size());
        saved = savedQueryList.get(0);
        Assert.assertEquals(newQuery.getName(), saved.getName());
        Assert.assertEquals(newQuery.getEndpointName(), saved.getEndpointName());
        // Not included.
        Assert.assertEquals(0, saved.getJdbcDataSourceId());
        Assert.assertNull(newQuery.getSqlQuery(), saved.getSqlQuery());
        Assert.assertNull(saved.getEndpointAccessCode());

        // ********** Update **********
        SavedQuery q2 = new SavedQuery();
        q2.setId(id);
        q2.setName("q2");
        q2.setSqlQuery("query2");
        q2.setJdbcDataSourceId(2);
        q2.setEndpointName("endpointName2");
        q2.setEndpointAccessCode("endpointAccessCode2");
        body = mapper.writeValueAsString(q2);
        mvcResult = mvc.perform(
                put(SAVEDQUERIES_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findSavedQuery(id);
        saved = mapper.readValue(responeText, SavedQuery.class);
        Assert.assertEquals(q2.getName(), saved.getName());
        Assert.assertEquals(q2.getSqlQuery(), saved.getSqlQuery());
        Assert.assertEquals(q2.getJdbcDataSourceId(), saved.getJdbcDataSourceId());
        Assert.assertEquals(q2.getEndpointName(), saved.getEndpointName());
        Assert.assertEquals(q2.getEndpointAccessCode(), saved.getEndpointAccessCode());

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete(SAVEDQUERIES_BASE_URL+ "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findSavedQuery(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private String findSavedQuery(long id) throws Exception {
        mvcResult = mvc.perform(
                get(SAVEDQUERIES_BASE_URL+ "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
