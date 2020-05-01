package com.shzlw.poli.util;

import org.springframework.lang.Nullable;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class CommonUtils {

    private CommonUtils() {}

    public static LocalDateTime fromEpoch(long epoch) {
        return Instant.ofEpochMilli(epoch).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public static long toEpoch(@Nullable LocalDateTime dateTime) {
        return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public static String toReadableDateTime(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return localDateTime.format(formatter);
    }

    public static String toReadableDate(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return localDateTime.format(formatter);
    }

    public static String getSimpleError(Exception e) {
        return "ERROR: " + e.getClass().getCanonicalName() + ": " + e.getMessage();
    }

    public static String getParamByAttrKey(String attrKey) {
        return "$user_attr[" + attrKey + "]";
    }
}
