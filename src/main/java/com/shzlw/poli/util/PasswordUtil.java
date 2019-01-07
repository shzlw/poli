package com.shzlw.poli.util;

import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigInteger;
import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;


public final class PasswordUtil {

    private PasswordUtil() {}

    public static String getMd5Hash(String s) {
        String rt = "";
        try {
            MessageDigest m = MessageDigest.getInstance("MD5");
            m.reset();
            m.update(s.getBytes());
            byte[] digest = m.digest();
            BigInteger bigInt = new BigInteger(1, digest);
            String hashtext = bigInt.toString(16);
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }
            return hashtext;
        } catch(Exception e) {
            e.printStackTrace();
        }
        return rt;
    }

    public static String encrypt(String value) {
        return encrypt(value, Constants.ENCRYPT_IV, Constants.ENCRYPT_KEY);
    }

    public static String decrypt(String value) {
        return decrypt(value, Constants.ENCRYPT_IV, Constants.ENCRYPT_KEY);
    }

    public static String encrypt(String value, String initVector, String key) {
        String rt = "";
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);
            byte[] encrypted = cipher.doFinal(value.getBytes());
            rt = new String(Base64.encodeBase64(encrypted));
        } catch (Exception e) {
        }

        return rt;
    }

    public static String decrypt(String val, String initVector, String key) {
        String rt = "";
        try {
            IvParameterSpec iv = new IvParameterSpec(initVector.getBytes("UTF-8"));
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            byte[] decrypted = cipher.doFinal(Base64.decodeBase64(val));
            rt = new String(decrypted);
        } catch (Exception e) {
        }
        return rt;
    }

    public static String getEncryptedPassword(String password) {
        return encrypt(Constants.PASSWORD_SALT + password);
    }

    public static String getDecryptedPassword(String password) {
        String p = decrypt(password);
        return p.substring(Constants.PASSWORD_SALT.length(), p.length());
    }
}
