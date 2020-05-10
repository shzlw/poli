package com.shzlw.poli.dao;

import com.shzlw.poli.model.AuditLog;
import com.shzlw.poli.util.CommonUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.List;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations="classpath:application-test.properties")
@Sql(scripts = "classpath:schema-sqlite.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class AuditLogDaoTest {

    @Autowired
    AuditLogDao auditLogDao;

    @Test
    public void test() {
        long epoch = CommonUtils.toEpoch(LocalDateTime.now());
        for (int i = 0; i < 20; i++) {
            auditLogDao.insert(epoch, "type", "data" + i);
        }

        List<AuditLog> list = auditLogDao.findAll(1, 10, "");
        Assert.assertEquals(10, list.size());
        for (int i = 0; i < 10; i++) {
            Assert.assertEquals("data" + (19 - i), list.get(i).getData());
        }
    }
}
