package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.Dashboard;
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
import org.springframework.util.StringUtils;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class DashboardWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // ********** Create **********
        Dashboard newDashboard = new Dashboard();
        newDashboard.setName("d1");
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
        long id = Long.valueOf(mvcResult.getResponse().getContentAsString());

        // Verify one
        responeText = findDashboard(id);
        Dashboard saved = mapper.readValue(responeText, Dashboard.class);
        Assert.assertEquals(newDashboard.getName(), saved.getName());
        Assert.assertEquals(newDashboard.getStyle(), saved.getStyle());

        // Verify the list
        mvcResult = mvc.perform(
                get("/ws/dashboard")
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Dashboard> dashboards = mapper.readValue(responeText, new TypeReference<List<Dashboard>>() {});
        Assert.assertEquals(1, dashboards.size());
        saved = dashboards.get(0);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(newDashboard.getName(), saved.getName());
        Assert.assertEquals(newDashboard.getStyle(), saved.getStyle());

        // ********** Update **********
        newDashboard = new Dashboard();
        newDashboard.setId(id);
        newDashboard.setName("d2");
        newDashboard.setStyle("{}");
        body = mapper.writeValueAsString(newDashboard);
        mvcResult = mvc.perform(
                put("/ws/dashboard")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();

        // Verify find by name
        mvcResult = mvc.perform(
                get("/ws/dashboard/name/" + newDashboard.getName())
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        saved = mapper.readValue(responeText, Dashboard.class);
        Assert.assertEquals(newDashboard.getId(), saved.getId());
        Assert.assertEquals(newDashboard.getName(), saved.getName());
        Assert.assertEquals(newDashboard.getStyle(), saved.getStyle());

        // ********** Delete **********
        // Create some widgets
        int numOfWidgets = 10;
        for (int i = 0; i < numOfWidgets; i++) {
            createWidget(id);
        }

        mvcResult = mvc.perform(
                delete("/ws/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findDashboard(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));

        // Verify there is no widget.
        mvcResult = mvc.perform(
                get("/ws/widget/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(Constants.EMPTY_JSON_ARRAY, responeText);
    }

    private String findDashboard(long id) throws Exception {
        mvcResult = mvc.perform(
                get("/ws/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
