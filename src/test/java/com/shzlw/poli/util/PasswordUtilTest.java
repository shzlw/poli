package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

public class PasswordUtilTest {

    @Test
    public void test() {
        String value = "1234567890";
        String b = PasswordUtil.decrypt(PasswordUtil.encrypt(value));
        Assert.assertEquals(value, b);
    }
}
