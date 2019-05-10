package com.shzlw.poli.rest;

import com.shzlw.poli.model.Dashboard;
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
        // Create
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
        String id = mvcResult.getResponse().getContentAsString();

        // Verify
        responeText = findDashboard(id);
        Dashboard savedDashboard = mapper.readValue(responeText, Dashboard.class);
        Assert.assertEquals(newDashboard.getName(), savedDashboard.getName());
        Assert.assertEquals(newDashboard.getStyle(), savedDashboard.getStyle());

        // Update
        newDashboard = new Dashboard();
        newDashboard.setId(savedDashboard.getId());
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

        // Verify
        responeText = findDashboard(id);
        savedDashboard = mapper.readValue(responeText, Dashboard.class);
        Assert.assertEquals(newDashboard.getId(), savedDashboard.getId());
        Assert.assertEquals(newDashboard.getName(), savedDashboard.getName());
        Assert.assertEquals(newDashboard.getStyle(), savedDashboard.getStyle());

        // Delete
        mvcResult = mvc.perform(
                delete("/ws/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findDashboard(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private String findDashboard(String id) throws Exception {
        mvcResult = mvc.perform(
                get("/ws/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
