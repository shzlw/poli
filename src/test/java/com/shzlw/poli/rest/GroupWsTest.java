package com.shzlw.poli.rest;


import com.fasterxml.jackson.core.type.TypeReference;
import com.shzlw.poli.model.Group;
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

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class GroupWsTest extends AbstractWsTest {

    @Test
    public void test() throws Exception {
        long d1 = createDashboard("d1");

        // ********** Create **********
        Group g1 = new Group();
        g1.setName("g1");
        g1.setGroupDashboards(Arrays.asList(d1));
        String body = mapper.writeValueAsString(g1);

        mvcResult = mvc.perform(
                post("/ws/group")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isCreated())
                .andReturn();
        long id = Long.valueOf(mvcResult.getResponse().getContentAsString());
        responeText = findGroup(id);
        Group saved = mapper.readValue(responeText, Group.class);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(g1.getName(), saved.getName());
        Assert.assertTrue(d1 == saved.getGroupDashboards().get(0));

        // Verify the list
        mvcResult = mvc.perform(
                get("/ws/group")
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        responeText = mvcResult.getResponse().getContentAsString();
        List<Group> groups = mapper.readValue(responeText, new TypeReference<List<Group>>() {});
        Assert.assertEquals(1, groups.size());
        saved = groups.get(0);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(g1.getName(), saved.getName());
        Assert.assertTrue(d1 == saved.getGroupDashboards().get(0));

        // ********** Update group information **********
        g1.setId(id);
        g1.setName("g2");
        body = mapper.writeValueAsString(g1);
        mvcResult = mvc.perform(
                put("/ws/group")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findGroup(id);
        saved = mapper.readValue(responeText, Group.class);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(g1.getName(), saved.getName());
        Assert.assertTrue(d1 == saved.getGroupDashboards().get(0));

        // ********** Update dashboards **********
        long d2 = createDashboard("d2");
        List<Long> dashboards = Arrays.asList(d1, d2);
        g1.setGroupDashboards(dashboards);
        body = mapper.writeValueAsString(g1);
        mvcResult = mvc.perform(
                put("/ws/group")
                        .contentType(MediaType.APPLICATION_JSON)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
                        .content(body)
        )
                .andExpect(status().isOk())
                .andReturn();
        responeText = findGroup(id);
        saved = mapper.readValue(responeText, Group.class);
        Assert.assertEquals(id, saved.getId());
        Assert.assertEquals(g1.getName(), saved.getName());
        Assert.assertEquals(new HashSet<Long>(dashboards), new HashSet<Long>(saved.getGroupDashboards()));

        // ********** Delete **********
        mvcResult = mvc.perform(
                delete("/ws/group/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andExpect(status().isNoContent())
                .andReturn();
        // Verify
        responeText = findGroup(id);
        Assert.assertTrue(StringUtils.isEmpty(responeText));
    }

    private String findGroup(long id) throws Exception {
        mvcResult = mvc.perform(
                get("/ws/group/" + id)
                        .requestAttr(Constants.HTTP_REQUEST_ATTR_USER, adminUser)
        )
                .andReturn();
        return mvcResult.getResponse().getContentAsString();
    }
}
