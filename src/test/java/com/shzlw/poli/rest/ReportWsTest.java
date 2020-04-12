package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.Group;
import com.shzlw.poli.model.Report;
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
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class ReportWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // ********** Create **********
        Report newReport = new Report();
        newReport.setName("d1");
        newReport.setStyle("{}");
        String body = mapper.writeValueAsString(newReport);

        mvcResult = mvc.perform(
                        post(REPORTS_BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                                .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                            .content(body)
                        )
                        .andExpect(status().isCreated())
                        .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());

        // Verify one
        responeText = findReport(id);
        Report saved = mapper.readValue(responeText, Report.class);
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertEquals(newReport.getStyle(), saved.getStyle());

        // Verify the list
        mvcResult = mvc.perform(
                get(REPORTS_BASE_URL)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Report> reports = mapper.readValue(responeText, new TypeReference<List<Report>>() {});
        Assert.assertEquals(1, reports.size());
        saved = reports.get(0);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertEquals(newReport.getStyle(), saved.getStyle());

        // ********** Update **********
        newReport = new Report();
        newReport.setId(id);
        newReport.setName("d2");
        newReport.setStyle("{}");
        body = mapper.writeValueAsString(newReport);
        mvcResult = mvc.perform(
                put(REPORTS_BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();

        // Verify find by name
        mvcResult = mvc.perform(
                get(REPORTS_BASE_URL + "/name/" + newReport.getName())
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        saved = mapper.readValue(responeText, Report.class);
        Assert.assertEquals(newReport.getId(), saved.getId());
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertEquals(newReport.getStyle(), saved.getStyle());

        // ********** Delete **********
        // Create some components
        int numOfComponents = 10;
        for (int i = 0; i < numOfComponents; i++) {
            createComponent(id);
        }

        mvcResult = mvc.perform(
                delete(REPORTS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findReport(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));

        // Verify there is no component.
        mvcResult = mvc.perform(
                get(COMPONENTS_BASE_URL + "/report/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Assert.assertEquals(Constants.EMPTY_JSON_ARRAY, responeText);
    }

    @Test
    public void testFindAllByViewer() throws Exception {
        long d1 = createReport("d1");
        long d2 = createReport("d2");
        Group g1 = createGroup("g1", Arrays.asList(d1));
        User u1 = createViewer("u1", Arrays.asList(g1.getId()));
        mvcResult = mvc.perform(
                get(REPORTS_BASE_URL)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, u1)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Report> reports = mapper.readValue(responeText, new TypeReference<List<Report>>() {});
        Assert.assertEquals(1, reports.size());
        Report saved = reports.get(0);
        Assert.assertEquals(d1, saved.getId());
    }

    private String findReport(long id) throws Exception {
        mvcResult = mvc.perform(
                get(REPORTS_BASE_URL + "/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
