package com.shzlw.poli.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shzlw.poli.model.JdbcDataSource;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class JdbcQueryService {

    @Autowired
    ObjectMapper mapper;

    public Connection getConnectionByType(JdbcDataSource ds) throws SQLException, ClassNotFoundException {
        return DriverManager.getConnection(ds.getConnectionUrl(), ds.getUsername(), ds.getPassword());
    }

    public String ping(JdbcDataSource ds) {
        try (Connection con = getConnectionByType(ds);
             PreparedStatement ps = con.prepareStatement(ds.getPing());
             ResultSet rs = ps.executeQuery();) {
            while (rs.next()) {
                break;
            }
            return "GOOD";
        } catch (Exception e) {
            return "ERROR: " + e.getClass().getCanonicalName() + ": "+  e.getMessage();
        }
    }

    public String fetchCsvByQuery(JdbcDataSource ds, String sql) {

        try (Connection con = getConnectionByType(ds);
             PreparedStatement ps = con.prepareStatement(sql);) {

            try (ResultSet rs = ps.executeQuery();) {
                StringBuilder table = new StringBuilder();

                ResultSetMetaData metadata = rs.getMetaData();
                int columnCount = metadata.getColumnCount();
                boolean isFirst = true;
                for (int i = 1; i <= columnCount; i++) {
                    String colName = metadata.getColumnName(i);
                    if (isFirst) {
                        table.append(colName);
                        isFirst = false;
                    } else {
                        table.append(",").append(colName);
                    }
                }

                table.append("\n");

                while (rs.next()) {
                    boolean isFirstCol = true;
                    for (int i = 1; i <= columnCount; i++) {
                        if (isFirstCol) {
                            table.append(rs.getString(i));
                            isFirstCol = false;
                        } else {
                            table.append(",").append(rs.getString(i));
                        }
                    }
                    table.append("\n");
                }
                return table.toString();
            }
        } catch (Exception e) {
            return "ERROR: " + e.getClass().getCanonicalName() + ": "+  e.getMessage();
        }
    }

    public String fetchJsonByQuery2(JdbcDataSource ds, String sql) {
        try (Connection con = getConnectionByType(ds);
             PreparedStatement ps = con.prepareStatement(sql);) {

            try (ResultSet rs = ps.executeQuery();) {
                ResultSetMetaData metadata = rs.getMetaData();
                int columnCount = metadata.getColumnCount();
                String[] columnNames = new String[columnCount + 1];
                for (int i = 1; i <= columnCount; i++) {
                    String colName = metadata.getColumnName(i);
                    columnNames[i] = colName;
                }

                ObjectMapper mapper = new ObjectMapper();
                ArrayNode array = mapper.createArrayNode();

                while (rs.next()) {
                    ObjectNode node = mapper.createObjectNode();
                    for (int i = 1; i <= columnCount; i++) {
                        node.put(columnNames[i], rs.getString(i));
                    }
                    array.add(node);
                }
                return array.toString();
            }
        } catch (Exception e) {
            return "ERROR: " + e.getClass().getCanonicalName() + ": "+  e.getMessage();
        }
    }

    public String fetchJsonByQuery(JdbcDataSource ds, String sql) {
        HikariDataSource hds = new HikariDataSource();
        hds.setJdbcUrl(ds.getConnectionUrl());
        hds.setUsername(ds.getUsername());
        hds.setPassword(ds.getPassword());
        NamedParameterJdbcTemplate npTemplate = new NamedParameterJdbcTemplate(hds);

        Map<String, String> namedParameters = new HashMap();
        String parsedSql = parseSqlStatementWithParams(sql, namedParameters);
        String result = npTemplate.query(parsedSql, new ResultSetExtractor<String>() {
            @Nullable
            @Override
            public String extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    int columnCount = metadata.getColumnCount();
                    String[] columnNames = new String[columnCount + 1];
                    for (int i = 1; i <= columnCount; i++) {
                        String colName = metadata.getColumnName(i);
                        columnNames[i] = colName;
                    }

                    ObjectMapper mapper = new ObjectMapper();
                    ArrayNode array = mapper.createArrayNode();

                    while (rs.next()) {
                        ObjectNode node = mapper.createObjectNode();
                        for (int i = 1; i <= columnCount; i++) {
                            node.put(columnNames[i], rs.getString(i));
                        }
                        array.add(node);
                    }
                    return array.toString();
                } catch (Exception e) {
                    return "ERROR: " + e.getClass().getCanonicalName() + ": " + e.getMessage();
                }
            }
        });

        return result;
    }

    public static String parseSqlStatementWithParams(String sql, Map<String, String> params) {
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
                        for (Map.Entry<String, String> entry : params.entrySet())  {
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
}
