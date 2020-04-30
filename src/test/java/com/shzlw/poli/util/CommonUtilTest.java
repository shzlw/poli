package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

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
    public void testToReadableDateTime() {
        String date = "2019-01-01 01:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:s");
        LocalDateTime dateTime = LocalDateTime.parse(date, formatter);
        Assert.assertEquals(date, CommonUtil.toReadableDateTime(dateTime));
    }

    @Test
    public void testToReadableDate() {
        String date = "2019-01-01 01:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:s");
        LocalDateTime dateTime = LocalDateTime.parse(date, formatter);
        Assert.assertEquals("2019-01-01", CommonUtil.toReadableDate(dateTime));
    }

    @Test
    public void testGetParamByAttrKey() {
        String rt = CommonUtil.getParamByAttrKey("attrKey");
        Assert.assertEquals("$user_attr[attrKey]", rt);
    }
}
