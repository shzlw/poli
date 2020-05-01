package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class CommonUtilsTest {

    @Test
    public void testFromEpoch() {
        Assert.assertNotNull(CommonUtils.fromEpoch(0));
    }

    @Test
    public void testFromEpoch_toEpoch() {
        LocalDateTime dateTime = LocalDateTime.now();
        long epoch = CommonUtils.toEpoch(dateTime);
        LocalDateTime newDateTime = CommonUtils.fromEpoch(epoch);
        long newEpoch = CommonUtils.toEpoch(newDateTime);

        Assert.assertEquals(0, dateTime.truncatedTo(ChronoUnit.SECONDS).compareTo(newDateTime.truncatedTo(ChronoUnit.SECONDS)));
        Assert.assertEquals(epoch, newEpoch);
    }

    @Test
    public void testToReadableDateTime() {
        String date = "2019-01-01 01:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:s");
        LocalDateTime dateTime = LocalDateTime.parse(date, formatter);
        Assert.assertEquals(date, CommonUtils.toReadableDateTime(dateTime));
    }

    @Test
    public void testToReadableDate() {
        String date = "2019-01-01 01:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:s");
        LocalDateTime dateTime = LocalDateTime.parse(date, formatter);
        Assert.assertEquals("2019-01-01", CommonUtils.toReadableDate(dateTime));
    }

    @Test
    public void testGetParamByAttrKey() {
        String rt = CommonUtils.getParamByAttrKey("attrKey");
        Assert.assertEquals("$user_attr[attrKey]", rt);
    }
}
