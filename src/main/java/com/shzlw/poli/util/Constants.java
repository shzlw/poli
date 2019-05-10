package com.shzlw.poli.util;

public final class Constants {

    private Constants() {}

    public static final String SUCCESS = "success";
    public static final String GOOD = "";
    public static final String ERROR = "";

    public static final String SESSION_KEY = "pskey";
    public static final int COOKIE_TIMEOUT = 8640000;

    public static final String API_KEY_PREFIX = "apk_";
    public static final String SESSION_KEY_PREFIX = "sk_";

    public static final String PASSWORD_SALT = "awesome";

    public static final String ENCRYPT_KEY = "1234salt1234salt";
    public static final String ENCRYPT_IV = "5678salt5678salt";

    public static final String FILTER_TYPE_SLICER = "slicer";
    public static final String FILTER_TYPE_SINGLE = "single";

    public static final String SLICER_SELECT_ALL = "select all";
    public static final String SLICER_SELECT_NONE = "select none";

    public static final String SYS_ROLE_VIEWER = "viewer";
    public static final String SYS_ROLE_DEVELOPER = "developer";
    public static final String SYS_ROLE_ADMIN = "admin";

    public static final String WIDGET_TYPE_FILTER = "filter";
    public static final String WIDGET_TYPE_CHART = "chart";

    public static final String EMPTY_JSON_ARRAY = "[]";
    public static final String HTTP_REQUEST_ATTR_USER = "attr_user";

    public static final String HTTP_METHOD_GET = "GET";
    public static final String HTTP_METHOD_POST = "POST";
    public static final String HTTP_METHOD_PUT = "PUT";
    public static final String HTTP_METHOD_DELETE = "DELETE";
}
