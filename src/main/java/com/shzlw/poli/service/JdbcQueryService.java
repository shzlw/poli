package com.shzlw.poli.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shzlw.poli.dto.Column;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.model.JdbcDataSource;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.*;
import java.util.*;

@Service
public class JdbcQueryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JdbcQueryService.class);

    @Autowired
    ObjectMapper mapper;

    @Autowired
    JdbcDataSourceService jdbcDataSourceService;

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

    public QueryResult fetchJsonByQuery(JdbcDataSource ds, String sql) {
        NamedParameterJdbcTemplate npTemplate = new NamedParameterJdbcTemplate(jdbcDataSourceService.getDataSource(ds));

        QueryResult queryResult = new QueryResult();
        Map<String, Object> namedParameters = new HashMap();
        String parsedSql = parseSqlStatementWithParams(sql, namedParameters);
        String result = npTemplate.query(parsedSql, namedParameters, new ResultSetExtractor<String>() {
            @Nullable
            @Override
            public String extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    int columnCount = metadata.getColumnCount();
                    String[] columnNames = new String[columnCount + 1];
                    List<Column> columns = new ArrayList<>();
                    Map<Integer, String> jdbcMappings = getAllJdbcTypeNames();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metadata.getColumnName(i);
                        int columnType = metadata.getColumnType(i);
                        columnNames[i] = columnName;
                        columns.add(new Column(columnName, jdbcMappings.get(columnType)));
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
                    String data = array.toString();
                    queryResult.setData(data);
                    queryResult.setColumns(columns);
                    return data;
                } catch (Exception e) {
                    String data = "ERROR: " + e.getClass().getCanonicalName() + ": " + e.getMessage();
                    queryResult.setData(data);
                    return data;
                }
            }
        });

        return queryResult;
    }

    public QueryResult fetchJsonWithParams(JdbcDataSource ds, String sql, List<FilterParameter> filterParams) {
        LOGGER.info("[fetchJsonWithParams] filterParams: {}", filterParams);
        NamedParameterJdbcTemplate npTemplate = new NamedParameterJdbcTemplate(jdbcDataSourceService.getDataSource(ds));

        Map<String, Object> namedParameters = new HashMap<>();
        if (filterParams != null) {
            for (FilterParameter param : filterParams) {
                if (param != null
                        && param.getParam() != null
                        && param.getValue() != null) {
                    String name = param.getParam();
                    String json = param.getValue();
                    try {
                        List<String> array = Arrays.asList(mapper.readValue(json, String[].class));
                        if (!array.isEmpty()) {
                            namedParameters.put(name, array);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                }
            }
        }

        QueryResult queryResult = new QueryResult();
        String parsedSql = parseSqlStatementWithParams(sql, namedParameters);
        String result = npTemplate.query(parsedSql, namedParameters, new ResultSetExtractor<String>() {
            @Nullable
            @Override
            public String extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    int columnCount = metadata.getColumnCount();
                    String[] columnNames = new String[columnCount + 1];
                    List<Column> columns = new ArrayList<>();
                    Map<Integer, String> jdbcMappings = getAllJdbcTypeNames();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metadata.getColumnName(i);
                        int columnType = metadata.getColumnType(i);
                        columnNames[i] = columnName;
                        columns.add(new Column(columnName, jdbcMappings.get(columnType)));
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
                    String data = array.toString();
                    queryResult.setData(data);
                    queryResult.setColumns(columns);
                    return data;
                } catch (Exception e) {
                    String data = "ERROR: " + e.getClass().getCanonicalName() + ": " + e.getMessage();
                    queryResult.setData(data);
                    return data;
                }
            }
        });

        return queryResult;
    }

    public static Map<Integer, String> getAllJdbcTypeNames() throws IllegalAccessException {
        Map<Integer, String> result = new HashMap<Integer, String>();
        for (Field field : java.sql.Types.class.getFields()) {
            result.put((Integer) field.get(null), field.getName());
        }
        return result;
    }

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
}
