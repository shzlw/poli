package com.shzlw.poli.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shzlw.poli.model.Dashboard;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class DashboardWsTest extends AbstractWsTest {

    @Test
    public void testCreate() throws Exception {
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

        mvcResult = mvc.perform(
                    get("/ws/dashboard/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                    )
                    .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Dashboard savedDashboard = mapper.readValue(responeText, Dashboard.class);

        Assert.assertEquals(newDashboard.getName(), savedDashboard.getName());
        Assert.assertEquals(newDashboard.getStyle(), savedDashboard.getStyle());
    }
}
