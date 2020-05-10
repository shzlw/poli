package com.shzlw.poli.service;

import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.util.Constants;
import org.springframework.util.StringUtils;

import java.util.*;

public final class JdbcQueryServiceHelper {

    private JdbcQueryServiceHelper() {}

    public static String parseSqlStatementWithParams(String sql, Map<String, Object> params) {
        StringBuilder sb = new StringBuilder();
        char[] s = sql.toCharArray();
        int i = 0;
        while (i < s.length) {
            if (s[i] == '{' && (i + 1 < s.length) && s[i + 1] == '{') {
                int j = i + 2;
                while (j < s.length) {
                    if (s[j] == '}' && (j + 1 < s.length) && s[j + 1] == '}') {
                        String clause = sql.substring(i + 2, j);
                        boolean hasParam = false;
                        for (Map.Entry<String, Object> entry : params.entrySet())  {
                            if (clause.contains(":" + entry.getKey())) {
                                hasParam = true;
                                break;
                            }
                        }

                        if (hasParam) {
                            sb.append(clause);
                        }

                        i = j + 2;
                        break;
                    }
                    j++;
                }
            }

            if (i < s.length) {
                sb.append(s[i]);
                i++;
            }
        }

        return sb.toString();
    }

    public static boolean isFilterParameterEmpty(FilterParameter p) {
        if (p == null
                || StringUtils.isEmpty(p.getType())
                || StringUtils.isEmpty(p.getParam())
                || StringUtils.isEmpty(p.getValue())) {
            return true;
        }

        return false;
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

    public static int calculateMaxQueryResultLimit(int maxQueryRecords, int resultLimit) {
        int maxQueryResult = 0;
        if (maxQueryRecords == Constants.MAXIMUM_QUERY_RECORDS_NOLIMIT) {
            maxQueryResult = resultLimit <= Constants.QUERY_RESULT_NOLIMIT ? Constants.QUERY_RESULT_NOLIMIT : resultLimit;
        } else {
            maxQueryResult = resultLimit <= Constants.QUERY_RESULT_NOLIMIT ? maxQueryRecords : Math.min(maxQueryRecords, resultLimit);
        }
        return maxQueryResult;
    }
}
