package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class CommonUtilTest {

    @Test
    public void testFromEpoch() {
        Assert.assertNotNull(CommonUtil.fromEpoch(0));
    }

    @Test
    public void testFromEpoch_toEpoch() {
        LocalDateTime dateTime = LocalDateTime.now();
        long epoch = CommonUtil.toEpoch(dateTime);
        LocalDateTime newDateTime = CommonUtil.fromEpoch(epoch);
        long newEpoch = CommonUtil.toEpoch(newDateTime);

        Assert.assertEquals(0, dateTime.truncatedTo(ChronoUnit.SECONDS).compareTo(newDateTime.truncatedTo(ChronoUnit.SECONDS)));
        Assert.assertEquals(epoch, newEpoch);
    }

    @Test
    public void testGetParamByAttrKey() {
        String rt = CommonUtil.getParamByAttrKey("attrKey");
        Assert.assertEquals("$user_attr[attrKey]", rt);
    }

    @Test
    public void testGetQueryStatements_1() {
        Assert.assertEquals(0, CommonUtil.getQueryStatements("").size());
        Assert.assertEquals(0, CommonUtil.getQueryStatements(null).size());
    }

    @Test
    public void testGetQueryStatements_2() {
        List<String> sqls = CommonUtil.getQueryStatements("aaa");
        Assert.assertEquals(1, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa");
    }

    @Test
    public void testGetQueryStatements_3() {
        List<String> sqls = CommonUtil.getQueryStatements("aaa;");
        Assert.assertEquals(1, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
    }

    @Test
    public void testGetQueryStatements_4() {
        List<String> sqls = CommonUtil.getQueryStatements("aaa;bbb;");
        Assert.assertEquals(2, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
        Assert.assertEquals(sqls.get(1), "bbb;");
    }

    @Test
    public void testGetQueryStatements_5() {
        List<String> sqls = CommonUtil.getQueryStatements("aaa;bbb;     ");
        Assert.assertEquals(2, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
        Assert.assertEquals(sqls.get(1), "bbb;");
    }
}
