package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.Widget;
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

import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class WidgetWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // Create a dashboard
        long dashboardId = createDashboard("d1");

        // ********** Create **********
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
        long id = Long.valueOf(mvcResult.getResponse().getContentAsString());

        // Verify
        responeText = findWidget(id);
        Widget saved = mapper.readValue(responeText, Widget.class);
        assertWidget(w1, saved);

        // Verify find by dashboard
        mvcResult = mvc.perform(
                get("/ws/widget/dashboard/" + dashboardId)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Widget> widgets = mapper.readValue(responeText, new TypeReference<List<Widget>>() {});
        Assert.assertEquals(1, widgets.size());
        saved = widgets.get(0);
        assertWidget(w1, saved);

        // ********** Update **********
        w1.setId(id);
        w1.setTitle("w2");
        w1.setType(Constants.WIDGET_TYPE_FILTER);
        w1.setFilterType(Constants.FILTER_TYPE_SINGLE);
        body = mapper.writeValueAsString(w1);
        mvcResult = mvc.perform(
                put("/ws/widget")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findWidget(id);
        saved = mapper.readValue(responeText, Widget.class);
        assertWidget(w1, saved);

        // ********** Update position **********
        w1.setX(5);
        w1.setY(6);
        w1.setWidth(7);
        w1.setHeight(8);
        List<Widget> widgetPositions = new ArrayList<>();
        widgetPositions.add(w1);
        body = mapper.writeValueAsString(widgetPositions);
        mvcResult = mvc.perform(
                post("/ws/widget/position")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findWidget(id);
        saved = mapper.readValue(responeText, Widget.class);
        assertWidget(w1, saved);

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete("/ws/widget/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findWidget(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));

        // Verify find by dashboard
        mvcResult = mvc.perform(
                get("/ws/widget/dashboard/" + dashboardId)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(Constants.EMPTY_JSON_ARRAY, responeText);
    }

    private String findWidget(long id) throws Exception {
        mvcResult = mvc.perform(
                get("/ws/widget/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }

    private void assertWidget(Widget expected, Widget target) {
        Assert.assertEquals(expected.getTitle(), target.getTitle());
        Assert.assertEquals(expected.getX(), target.getX());
        Assert.assertEquals(expected.getY(), target.getY());
        Assert.assertEquals(expected.getWidth(), target.getWidth());
        Assert.assertEquals(expected.getHeight(), target.getHeight());
        Assert.assertEquals(expected.getType(), target.getType());
        Assert.assertEquals(expected.getChartType(), target.getChartType());
        Assert.assertEquals(expected.getFilterType(), target.getFilterType());
        Assert.assertEquals(expected.getData(), target.getData());
        Assert.assertEquals(expected.getStyle(), target.getStyle());
        Assert.assertEquals(expected.getDrillThrough(), target.getDrillThrough());
        Assert.assertEquals(expected.getDashboardId(), target.getDashboardId());
    }
}