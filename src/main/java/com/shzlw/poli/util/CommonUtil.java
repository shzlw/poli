package com.shzlw.poli.util;

import org.springframework.lang.Nullable;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class CommonUtil {

    private CommonUtil() {}

    public static LocalDateTime fromEpoch(long epoch) {
        return Instant.ofEpochMilli(epoch).atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public static long toEpoch(@Nullable LocalDateTime dateTime) {
        return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

    public static String getCurrentReadableDateTime() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return now.format(formatter);
    }

    public static String getParamByAttrKey(String attrKey) {
        return "$user_attr[" + attrKey + "]";
    }

    public static List<String> getQueryStatements(String sql) {
        if (sql == null || sql.isEmpty()) {
            return Collections.emptyList();
        }

        if (!sql.contains(";")) {
            return Arrays.asList(sql);
        }

        List<String> statements = new ArrayList<>();
        String[] sqlArray = sql.split(";");
        for (String s : sqlArray) {
            String t = s.trim();
            if (!t.isEmpty()) {
                statements.add(t + ";");
            }
        }
        return statements;
    }
}
