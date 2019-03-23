package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class CommonUtilTest {

    @Test
    public void test_fromEpoch() {
        Assert.assertNotNull(CommonUtil.fromEpoch(0));
    }

    @Test
    public void test_fromEpoch_toEpoch() {
        LocalDateTime dateTime = LocalDateTime.now();
        long epoch = CommonUtil.toEpoch(dateTime);
        LocalDateTime newDateTime = CommonUtil.fromEpoch(epoch);
        long newEpoch = CommonUtil.toEpoch(newDateTime);

        Assert.assertEquals(0, dateTime.truncatedTo(ChronoUnit.SECONDS).compareTo(newDateTime.truncatedTo(ChronoUnit.SECONDS)));
        Assert.assertEquals(epoch, newEpoch);
    }
}
