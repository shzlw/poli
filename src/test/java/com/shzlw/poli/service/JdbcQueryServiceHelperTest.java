package com.shzlw.poli.service;

import com.shzlw.poli.util.Constants;
import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class JdbcQueryServiceHelperTest {

    @Test
    public void testParseSqlStatementWithParams_1() {
        String sql = "SELECT * FROM table "
                + "WHERE 1=1 {{AND field IN (:fields)}} {{AND time > :startTime}} AND user='2' {{AND status =:status }} AND column3='2'";
        String expected = "SELECT * FROM table WHERE 1=1 AND field IN (:fields) AND time > :startTime AND user='2'  AND column3='2'";
        Map<String, Object> params = new HashMap<>();
        params.put("fields", "a, b, c");
        params.put("startTime", "12-01");
        Assert.assertEquals(expected, JdbcQueryServiceHelper.parseSqlStatementWithParams(sql, params));
    }

    @Test
    public void testParseSqlStatementWithParams_2() {
        String sql = "SELECT * FROM table";
        Assert.assertEquals(sql, JdbcQueryServiceHelper.parseSqlStatementWithParams(sql, new HashMap<>()));

        sql = "SELECT * FROM table WHERE a='{{{'";
        Assert.assertEquals(sql, JdbcQueryServiceHelper.parseSqlStatementWithParams(sql, new HashMap<>()));

        sql = "SELECT * FROM table WHERE a='}'";
        Assert.assertEquals(sql, JdbcQueryServiceHelper.parseSqlStatementWithParams(sql, new HashMap<>()));
    }

    @Test
    public void testParseSqlStatementWithParams_3() {
        String sql = "SELECT * FROM table WHERE 1=1 {{AND field IN (:fields)}}";
        String expected = "SELECT * FROM table WHERE 1=1 ";
        Assert.assertEquals(expected, JdbcQueryServiceHelper.parseSqlStatementWithParams(sql, new HashMap<>()));
    }

    @Test
    public void testGetQueryStatements_1() {
        Assert.assertEquals(0, JdbcQueryServiceHelper.getQueryStatements("").size());
        Assert.assertEquals(0, JdbcQueryServiceHelper.getQueryStatements(null).size());
    }

    @Test
    public void testGetQueryStatements_2() {
        List<String> sqls = JdbcQueryServiceHelper.getQueryStatements("aaa");
        Assert.assertEquals(1, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa");
    }

    @Test
    public void testGetQueryStatements_3() {
        List<String> sqls = JdbcQueryServiceHelper.getQueryStatements("aaa;");
        Assert.assertEquals(1, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
    }

    @Test
    public void testGetQueryStatements_4() {
        List<String> sqls = JdbcQueryServiceHelper.getQueryStatements("aaa;bbb;");
        Assert.assertEquals(2, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
        Assert.assertEquals(sqls.get(1), "bbb;");
    }

    @Test
    public void testGetQueryStatements_5() {
        List<String> sqls = JdbcQueryServiceHelper.getQueryStatements("aaa;bbb;     ");
        Assert.assertEquals(2, sqls.size());
        Assert.assertEquals(sqls.get(0), "aaa;");
        Assert.assertEquals(sqls.get(1), "bbb;");
    }

    public void testCalculateMaxQueryResultLimit() {
        Assert.assertEquals(Constants.QUERY_RESULT_NOLIMIT, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(Constants.MAXIMUM_QUERY_RECORDS_NOLIMIT, Constants.QUERY_RESULT_NOLIMIT));
        Assert.assertEquals(1, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(1, Constants.QUERY_RESULT_NOLIMIT));
        Assert.assertEquals(2, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(Constants.MAXIMUM_QUERY_RECORDS_NOLIMIT, 2));
        Assert.assertEquals(3, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(3, 4));
        Assert.assertEquals(3, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(3, 3));
        Assert.assertEquals(3, JdbcQueryServiceHelper.calculateMaxQueryResultLimit(4, 3));
    }
}
