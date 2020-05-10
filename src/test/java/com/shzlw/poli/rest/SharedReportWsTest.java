package com.shzlw.poli.rest;

import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.util.CommonUtils;
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

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class SharedReportWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        // ********** Create a report **********
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
        long reportId = Long.parseLong(mvcResult.getResponse().getContentAsString());
        newReport.setId(reportId);

        LocalDateTime tenDaysFromNow = LocalDateTime.now().plusDays(10);
        SharedReport sharedReport = new SharedReport();
        sharedReport.setReportId(reportId);
        sharedReport.setReportType("adhoc");
        sharedReport.setExpiredBy(CommonUtils.toEpoch(tenDaysFromNow));

        body = mapper.writeValueAsString(sharedReport);
        mvcResult = mvc.perform(
                post(SHAREDREPORTS_BASE_URL + "/generate-sharekey")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        String shareKey = mvcResult.getResponse().getContentAsString();

        mvcResult = mvc.perform(
                get(REPORTS_BASE_URL + "/sharekey/" + shareKey)
                        .requestAttr(Constants.HTTP_HEADER_SHARE_KEY, shareKey)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        Report saved = mapper.readValue(responeText, Report.class);
        Assert.assertEquals(newReport.getId(), saved.getId());
        Assert.assertEquals(newReport.getName(), saved.getName());
        Assert.assertEquals(newReport.getStyle(), saved.getStyle());
    }
}
