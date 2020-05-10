package com.shzlw.poli.filter;

import com.shzlw.poli.util.Constants;

import java.util.*;

public final class AuthFilterHelper {

    private AuthFilterHelper() {}

    private static final List<String> VIEWER_GET_PATH = Arrays.asList(
            "/ws/reports",
            "/ws/cannedreports",
            "/ws/components/report/",
            "/ws/users/account",
            "/ws/sharedreports/generate-sharekey"
    );

    private static final List<String> VIEWER_PUT_PATH = Arrays.asList(
            "/ws/users/account"
    );

    private static final List<String> VIEWER_POST_PATH = Arrays.asList(
            "/ws/jdbcquery",
            "/ws/cannedreports",
            "/ws/reports/favourite",
            "/ws/reports/pdf"
    );

    private static final List<String> VIEWER_DELETE_PATH = Arrays.asList(
            "/ws/cannedreports"
    );

    private static final Map<String, List<String>> VIEWER_MAP;
    static {
        Map<String, List<String>> viewerTemp = new HashMap<>();
        viewerTemp.put(Constants.HTTP_METHOD_GET, VIEWER_GET_PATH);
        viewerTemp.put(Constants.HTTP_METHOD_PUT, VIEWER_PUT_PATH);
        viewerTemp.put(Constants.HTTP_METHOD_POST, VIEWER_POST_PATH);
        viewerTemp.put(Constants.HTTP_METHOD_DELETE, VIEWER_DELETE_PATH);
        VIEWER_MAP = Collections.unmodifiableMap(viewerTemp);
    }

    private static final List<String> APIKEY_GET_PATH = Arrays.asList(
            "/ws/reports",
            "/ws/cannedreports",
            "/ws/components/report/"
    );
    private static final List<String> APIKEY_POST_PATH = Arrays.asList(
            "/ws/jdbcquery/component"
    );

    private static final Map<String, List<String>> APIKEY_MAP;
    static {
        Map<String, List<String>> apikeyTemp = new HashMap<>();
        apikeyTemp.put(Constants.HTTP_METHOD_GET, APIKEY_GET_PATH);
        apikeyTemp.put(Constants.HTTP_METHOD_POST, APIKEY_POST_PATH);
        APIKEY_MAP = Collections.unmodifiableMap(apikeyTemp);
    }

    public static boolean validateViewer(String requestMethod, String path) {
        return isPathStartWith(path, VIEWER_MAP.get(requestMethod));
    }

    public static boolean validateByApiKey(String requestMethod, String path) {
        return isPathStartWith(path, APIKEY_MAP.get(requestMethod));
    }

    private static boolean isPathStartWith(String path, List<String> startWithList) {
        if (path == null || startWithList == null) {
            return false;
        }

        for (String s : startWithList) {
            if (path.startsWith(s)) {
                return true;
            }
        }
        return false;
    }
}
