package com.shzlw.poli.dao;

public final class DaoHelper {

    public static final int DEFAULT_LIMIT = 20;
    public static final int DEFAULT_OFFSET = 0;

    private DaoHelper() {}

    public static int toOffset(int page, int pageSize) {
        if (page < 1 || pageSize < 1) {
            return DEFAULT_OFFSET;
        }

        return (page - 1) * pageSize;
    }

    public static int toLimit(int pageSize) {
        return pageSize > 0 ? pageSize : DEFAULT_LIMIT;
    }

    public static String getLikeParam(String val) {
        return "%" + val + "%";
    }
}
