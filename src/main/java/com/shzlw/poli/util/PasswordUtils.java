package com.shzlw.poli.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.UUID;

public final class PasswordUtils {

    private PasswordUtils() {}

    public static synchronized String getUniqueId() {
        return uuidToBase64(UUID.randomUUID().toString());
    }

    private static String uuidToBase64(String str) {
        UUID uuid = UUID.fromString(str);
        ByteBuffer bb = ByteBuffer.wrap(new byte[16]);
        bb.putLong(uuid.getMostSignificantBits());
        bb.putLong(uuid.getLeastSignificantBits());
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bb.array());
    }

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
            rt = new String(Base64.getEncoder().encodeToString(encrypted));
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

            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(val));
            rt = new String(decrypted);
        } catch (Exception e) {
        }
        return rt;
    }

    public static String getEncryptedPassword(String password) {
        String p = password == null ? "" : password;
        return encrypt(Constants.PASSWORD_SALT + p);
    }

    public static String getDecryptedPassword(String password) {
        String p = decrypt(password);
        int saltLength = Constants.PASSWORD_SALT.length();
        return p.substring(saltLength);
    }

    public static String padOrTrimTo16(String str) {
        String s = str;
        if (str == null) {
            s = "";
        }

        if (s.length() == 16) {
            return s;
        } else if (s.length() > 16) {
            return s.substring(0, 16);
        }

        int l = 16 - s.length();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < l; i++) {
            sb.append("0");
        }
        sb.append(s);
        return sb.toString();
    }
}
