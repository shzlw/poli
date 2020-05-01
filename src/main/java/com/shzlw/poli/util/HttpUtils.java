package com.shzlw.poli.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public final class HttpUtils {

    private HttpUtils() {}

    public static String getSessionKey(HttpServletRequest httpRequest) {
        Cookie[] cookies = httpRequest.getCookies();
        if (cookies == null || cookies.length == 0) {
            return null;
        }

        for (int i = 0; i < cookies.length; i++) {
            String name = cookies[i].getName();
            String value = cookies[i].getValue();
            if (Constants.SESSION_KEY.equals(name)) {
                return value;
            }
        }
        return null;
    }

    public static String getIpAddress(HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        return ipAddress;
    }
}
