package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.Component;
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
public class ComponentWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // Create a report
        long reportId = createReport("d1");

        // ********** Create **********
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
                post(COMPONENTS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());

        // Verify
        responeText = findComponent(id);
        Component saved = mapper.readValue(responeText, Component.class);
        assertComponent(w1, saved);

        // Verify find by report
        mvcResult = mvc.perform(
                get(COMPONENTS_BASE_URL + "/report/" + reportId)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Component> components = mapper.readValue(responeText, new TypeReference<List<Component>>() {});
        Assert.assertEquals(1, components.size());
        saved = components.get(0);
        assertComponent(w1, saved);

        // ********** Update data **********
        w1.setId(id);
        w1.setType(Constants.COMPONENT_TYPE_FILTER);
        w1.setSubType(Constants.FILTER_TYPE_SINGLE);
        body = mapper.writeValueAsString(w1);
        mvcResult = mvc.perform(
                put(COMPONENTS_BASE_URL + "/data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findComponent(id);
        saved = mapper.readValue(responeText, Component.class);
        assertComponent(w1, saved);

        // ********** Update position and style **********
        w1.setTitle("w3");
        w1.setWidth(300);
        w1.setHeight(300);
        w1.setType(Constants.COMPONENT_TYPE_FILTER);
        w1.setSubType(Constants.FILTER_TYPE_SINGLE);
        body = mapper.writeValueAsString(w1);
        mvcResult = mvc.perform(
                put(COMPONENTS_BASE_URL + "/style")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findComponent(id);
        saved = mapper.readValue(responeText, Component.class);
        assertComponent(w1, saved);

        // ********** Update position **********
        w1.setX(5);
        w1.setY(6);
        w1.setWidth(7);
        w1.setHeight(8);
        body = mapper.writeValueAsString(w1);
        mvcResult = mvc.perform(
                put(COMPONENTS_BASE_URL + "/position")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findComponent(id);
        saved = mapper.readValue(responeText, Component.class);
        assertComponent(w1, saved);

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete(COMPONENTS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findComponent(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));

        // Verify find by report
        mvcResult = mvc.perform(
                get(COMPONENTS_BASE_URL + "/report/" + reportId)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(Constants.EMPTY_JSON_ARRAY, responeText);
    }

    private String findComponent(long id) throws Exception {
        mvcResult = mvc.perform(
                get(COMPONENTS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }

    private void assertComponent(Component expected, Component target) {
        Assert.assertEquals(expected.getTitle(), target.getTitle());
        Assert.assertEquals(expected.getX(), target.getX());
        Assert.assertEquals(expected.getY(), target.getY());
        Assert.assertEquals(expected.getWidth(), target.getWidth());
        Assert.assertEquals(expected.getHeight(), target.getHeight());
        Assert.assertEquals(expected.getType(), target.getType());
        Assert.assertEquals(expected.getSubType(), target.getSubType());
        Assert.assertEquals(expected.getData(), target.getData());
        Assert.assertEquals(expected.getStyle(), target.getStyle());
        Assert.assertEquals(expected.getDrillThrough(), target.getDrillThrough());
        Assert.assertEquals(expected.getReportId(), target.getReportId());
    }
}