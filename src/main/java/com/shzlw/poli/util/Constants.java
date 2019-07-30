package com.shzlw.poli.util;

public final class Constants {

    private Constants() {}

    public static final String CURRENT_VERSION = "0.9.1";

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
    public static final String FILTER_TYPE_DATE_PICKER = "date picker";
    public static final String FILTER_TYPE_USER_ATTRIBUTE = "user attribute";

    public static final String SLICER_SELECT_ALL = "select all";
    public static final String SLICER_SELECT_NONE = "select none";

    public static final String SYS_ROLE_VIEWER = "viewer";
    public static final String SYS_ROLE_DEVELOPER = "developer";
    public static final String SYS_ROLE_ADMIN = "admin";

    public static final String COMPONENT_TYPE_FILTER = "filter";
    public static final String COMPONENT_TYPE_CHART = "chart";
    public static final String COMPONENT_TYPE_STATIC = "static";

    public static final String EMPTY_JSON_ARRAY = "[]";
    public static final String HTTP_REQUEST_ATTR_USER = "attr_user";

    public static final String HTTP_METHOD_GET = "GET";
    public static final String HTTP_METHOD_POST = "POST";
    public static final String HTTP_METHOD_PUT = "PUT";
    public static final String HTTP_METHOD_DELETE = "DELETE";

    public static final String HTTP_HEADER_API_KEY = "Poli-Api-Key";

    public static final String ERROR_NO_DATA_SOURCE_FOUND = "No data source found";
    public static final String ERROR_EMPTY_SQL_QUERY = "SQL query cannot be empty";

}
