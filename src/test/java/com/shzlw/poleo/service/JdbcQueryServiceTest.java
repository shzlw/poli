package com.shzlw.poleo.service;

import org.junit.Assert;
import org.junit.Test;

import java.util.HashMap;
import java.util.Map;

public class JdbcQueryServiceTest {

    @Test
    public void testParseSqlStatementWithParams_1() {
        String sql = "SELECT * FROM table "
                    + "WHERE 1=1 {{AND field IN (:fields)}} {{AND time > :startTime}} AND user='2' {{AND status =:status }} AND column3='2'";
        String expected = "SELECT * FROM table WHERE 1=1 AND field IN (:fields) AND time > :startTime AND user='2'  AND column3='2'";
        Map<String, Object> params = new HashMap<>();
        params.put("fields", "a, b, c");
        params.put("startTime", "12-01");
        Assert.assertEquals(expected, JdbcQueryService.parseSqlStatementWithParams(sql, params));
    }

    @Test
    public void testParseSqlStatementWithParams_2() {
        String sql = "SELECT * FROM table";
        Assert.assertEquals(sql, JdbcQueryService.parseSqlStatementWithParams(sql, new HashMap<>()));

        sql = "SELECT * FROM table WHERE a='{{{'";
        Assert.assertEquals(sql, JdbcQueryService.parseSqlStatementWithParams(sql, new HashMap<>()));

        sql = "SELECT * FROM table WHERE a='}'";
        Assert.assertEquals(sql, JdbcQueryService.parseSqlStatementWithParams(sql, new HashMap<>()));
    }

    @Test
    public void testParseSqlStatementWithParams_3() {
        String sql = "SELECT * FROM table WHERE 1=1 {{AND field IN (:fields)}}";
        String expected = "SELECT * FROM table WHERE 1=1 ";
        Assert.assertEquals(expected, JdbcQueryService.parseSqlStatementWithParams(sql, new HashMap<>()));
    }
}
