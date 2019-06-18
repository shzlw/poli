package com.shzlw.poli.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shzlw.poli.AppProperties;
import com.shzlw.poli.dto.Column;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.dto.Table;
import com.shzlw.poli.model.JdbcDataSource;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;
import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Date;

@Service
public class JdbcQueryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JdbcQueryService.class);

    private static Map<Integer, String> JDBC_TYPE_MAP = new HashMap<>();

    @Autowired
    ObjectMapper mapper;

    @Autowired
    AppProperties appProperties;

    @PostConstruct
    public void init() throws IllegalAccessException {
        for (Field field : java.sql.Types.class.getFields()) {
            JDBC_TYPE_MAP.put((Integer) field.get(null), field.getName());
        }
    }

    public String ping(DataSource dataSource, String sql) {
        try (Connection con = dataSource.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery();) {
            while (rs.next()) {
                break;
            }
            return Constants.SUCCESS;
        } catch (Exception e) {
            return getSimpleError(e);
        }
    }

    public List<Table> getSchema(DataSource dataSource) {
        List<Table> tables = new ArrayList<>();
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData metaData = conn.getMetaData();
            ResultSet rs = metaData.getTables(null, null, null, null);
            while (rs.next()) {
                String name = rs.getString("TABLE_NAME");
                String type = rs.getString("TABLE_TYPE");
                tables.add(new Table(name, type));
            }

            for (Table t : tables) {
                rs = metaData.getColumns(null, null, t.getName(), null);
                List<Column> columns = new ArrayList<>();

                while (rs.next()) {
                    String columnName = rs.getString("COLUMN_NAME");
                    int javaType = rs.getInt("DATA_TYPE");
                    String dbType = rs.getString("TYPE_NAME");
                    int length = rs.getInt("COLUMN_SIZE");
                    columns.add(new Column(columnName, JDBC_TYPE_MAP.get(javaType), dbType, length));
                }
                t.setColumns(columns);
            }
            return tables;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public QueryResult queryComponentByParams(DataSource dataSource, String sql, List<FilterParameter> filterParams) {
        if (dataSource == null) {
            return QueryResult.ofError(Constants.ERROR_NO_DATA_SOURCE_FOUND);
        } else if (StringUtils.isEmpty(sql)) {
            return QueryResult.ofError(Constants.ERROR_EMPTY_SQL_QUERY);
        }

        NamedParameterJdbcTemplate npTemplate = new NamedParameterJdbcTemplate(dataSource);
        Map<String, Object> namedParameters = getNamedParameters(filterParams);
        String parsedSql = parseSqlStatementWithParams(sql, namedParameters);

        int maxQueryRecords = appProperties.getMaximumQueryRecords();

        QueryResult result = npTemplate.query(parsedSql, namedParameters, new ResultSetExtractor<QueryResult>() {
            @Nullable
            @Override
            public QueryResult extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    int columnCount = metadata.getColumnCount();
                    String[] columnNames = new String[columnCount + 1];
                    List<Column> columns = new ArrayList<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = metadata.getColumnName(i);
                        int columnType = metadata.getColumnType(i);
                        String dbType = metadata.getColumnTypeName(i);
                        int length = metadata.getColumnDisplaySize(i);
                        columnNames[i] = columnName;
                        columns.add(new Column(columnName, JDBC_TYPE_MAP.get(columnType), dbType, length));
                    }

                    ObjectMapper mapper = new ObjectMapper();
                    ArrayNode array = mapper.createArrayNode();

                    int rowCount = 0;
                    while (rs.next()) {
                        ObjectNode node = mapper.createObjectNode();
                        for (int i = 1; i <= columnCount; i++) {
                            node.put(columnNames[i], rs.getString(i));
                        }
                        array.add(node);
                        rowCount++;
                        if (maxQueryRecords != -1 && rowCount >= maxQueryRecords) {
                            break;
                        }
                    }
                    String data = array.toString();
                    return QueryResult.ofData(data, columns);
                } catch (Exception e) {
                    String error = getSimpleError(e);
                    return QueryResult.ofError(error);
                }
            }
        });

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

    public Map<String, Object> getNamedParameters(final List<FilterParameter> filterParams) {
        Map<String, Object> namedParameters = new HashMap<>();
        if (filterParams == null || filterParams.isEmpty()) {
            return namedParameters;
        }

        for (FilterParameter param : filterParams) {
            if (!isFilterParameterEmpty(param)) {
                String type = param.getType();
                String name = param.getParam();
                String value = param.getValue();

                if (type.equals(Constants.FILTER_TYPE_SLICER)) {
                    String remark = param.getRemark();
                    if (remark == null) {
                        try {
                            List<String> array = Arrays.asList(mapper.readValue(value, String[].class));
                            if (!array.isEmpty()) {
                                namedParameters.put(name, array);
                            }
                        } catch (IOException e) {
                            LOGGER.warn("exception: {}", e);
                        }
                    }
                } else if (type.equals(Constants.FILTER_TYPE_SINGLE)) {
                    try {
                        String singleValue = mapper.readValue(value, String.class);
                        namedParameters.put(name, singleValue);
                    } catch (IOException e) {
                        LOGGER.warn("exception: {}", e);
                    }
                } else if (type.equals(Constants.FILTER_TYPE_DATE_PICKER)) {
                    try {
                        String dateStr = mapper.readValue(value, String.class);
                        if (!StringUtils.isEmpty(dateStr)) {
                            Date date = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
                            namedParameters.put(name, date);
                        }
                    } catch (IOException | ParseException e) {
                        LOGGER.warn("exception: {}", e);
                    }
                }
                else {
                    throw new IllegalArgumentException("Unknown filter type");
                }
            }
        }
        return namedParameters;
    }

    private static boolean isFilterParameterEmpty(FilterParameter p) {
        if (p == null
                || StringUtils.isEmpty(p.getType())
                || StringUtils.isEmpty(p.getParam())
                || StringUtils.isEmpty(p.getValue())) {
            return true;
        }

        return false;
    }

    private static String getSimpleError(Exception e) {
        return "ERROR: " + e.getClass().getCanonicalName() + ": " + e.getMessage();
    }
}
