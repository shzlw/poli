package com.shzlw.poli.util;

import org.junit.Assert;
import org.junit.Test;

public class PasswordUtilsTest {

    @Test
    public void testDecryptEncrypt() {
        String value = "1234567890";
        String b = PasswordUtils.decrypt(PasswordUtils.encrypt(value));
        Assert.assertEquals(value, b);
    }

    @Test
    public void testEncryptedPassword_2() {
        String password = "1234567890";
        Assert.assertEquals(password, PasswordUtils.getDecryptedPassword(PasswordUtils.getEncryptedPassword(password)));

        password = "";
        Assert.assertEquals(password, PasswordUtils.getDecryptedPassword(PasswordUtils.getEncryptedPassword(password)));

        password = null;
        Assert.assertEquals("", PasswordUtils.getDecryptedPassword(PasswordUtils.getEncryptedPassword(password)));
    }

    @Test
    public void testGetUniqueId() {
        Assert.assertEquals(22, PasswordUtils.getUniqueId().length());
    }

    @Test
    public void testGenerateAdminPassword() {
        String password = "adminadmin";
        Assert.assertNotNull(PasswordUtils.getMd5Hash(password));
    }

    @Test
    public void testPadOrTrimTo16() {
        Assert.assertEquals("0000000000000000", PasswordUtils.padOrTrimTo16(null));
        Assert.assertEquals("0000000000000000", PasswordUtils.padOrTrimTo16(""));
        Assert.assertEquals("0000000000000001", PasswordUtils.padOrTrimTo16("1"));
        Assert.assertEquals("1234567812345678", PasswordUtils.padOrTrimTo16("1234567812345678"));
        Assert.assertEquals("1234567812345678", PasswordUtils.padOrTrimTo16("12345678123456789"));
    }
}
