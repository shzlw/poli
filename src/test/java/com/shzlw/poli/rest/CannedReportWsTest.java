package com.shzlw.poli.rest;

import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.CannedReport;
import com.shzlw.poli.model.Report;
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
public class CannedReportWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // ********** Create **********
        CannedReport newReport = new CannedReport();
        newReport.setName("d1");
        newReport.setCreatedBy("c1");
        newReport.setCreatedAt(123);
        newReport.setData("{}");
        String body = mapper.writeValueAsString(newReport);

        mvcResult = mvc.perform(
                post("/ws/cannedreport")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.parseLong(mvcResult.getResponse().getContentAsString());

        // Verify one
        responeText = findReport(id);
        CannedReport saved = mapper.readValue(responeText, CannedReport.class);
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertEquals(newReport.getData(), saved.getData());

        // Verify the list
        mvcResult = mvc.perform(
                get("/ws/cannedreport")
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<CannedReport> cannedReports = mapper.readValue(responeText, new TypeReference<List<CannedReport>>() {});
        Assert.assertEquals(1, cannedReports.size());
        saved = cannedReports.get(0);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertNull(saved.getData());

        mvcResult = mvc.perform(
                delete("/ws/cannedreport/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findReport(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private String findReport(long id) throws Exception {
        mvcResult = mvc.perform(
                get("/ws/cannedreport/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
