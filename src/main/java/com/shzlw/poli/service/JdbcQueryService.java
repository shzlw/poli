package com.shzlw.poli.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.shzlw.poli.config.AppProperties;
import com.shzlw.poli.dto.Column;
import com.shzlw.poli.dto.FilterParameter;
import com.shzlw.poli.dto.QueryResult;
import com.shzlw.poli.dto.Table;
import com.shzlw.poli.util.CommonUtils;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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
import java.util.Date;
import java.util.*;

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
            return CommonUtils.getSimpleError(e);
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

    public QueryResult queryByParams(
            DataSource dataSource,
            String sql,
            List<FilterParameter> filterParams,
            int resultLimit
    ) {
        if (dataSource == null) {
            return QueryResult.ofError(Constants.ERROR_NO_DATA_SOURCE_FOUND);
        } else if (StringUtils.isEmpty(sql)) {
            return QueryResult.ofError(Constants.ERROR_EMPTY_SQL_QUERY);
        }

        NamedParameterJdbcTemplate npjt = new NamedParameterJdbcTemplate(dataSource);
        Map<String, Object> namedParameters = getNamedParameters(filterParams);

        // Handle multiple SQL statements.
        // If there are multiple sql statements, only return query results from the last query.
        List<String> sqls = JdbcQueryServiceHelper.getQueryStatements(sql);
        int preQueryNumber = sqls.size() - 1;
        if (appProperties.getAllowMultipleQueryStatements()) {
            for (int i = 0; i < preQueryNumber; i++) {
                String parsedSql = JdbcQueryServiceHelper.parseSqlStatementWithParams(sqls.get(i), namedParameters);
                npjt.execute(parsedSql, (ps) -> ps.execute());
            }
        }

        String parsedSql = JdbcQueryServiceHelper.parseSqlStatementWithParams(sqls.get(preQueryNumber), namedParameters);
        return executeQuery(npjt, parsedSql, namedParameters, resultLimit);
    }

    public QueryResult executeQuery(DataSource dataSource, String sql, String contentType) {
        JdbcTemplate jt = new JdbcTemplate(dataSource);
        final int maxQueryResult = JdbcQueryServiceHelper.calculateMaxQueryResultLimit(appProperties.getMaximumQueryRecords(), Constants.QUERY_RESULT_NOLIMIT);

        QueryResult result = jt.query(sql, new Object[] {}, new ResultSetExtractor<QueryResult>() {
            @Nullable
            @Override
            public QueryResult extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    String[] columnNames = getColumnNames(metadata);
                    List<Column> columns = getColumnList(metadata);
                    String data;
                    if (Constants.CONTENT_TYPE_CSV.equals(contentType)) {
                        data = resultSetToCsvString(rs, columnNames, maxQueryResult);
                    } else {
                        data = resultSetToJsonString(rs, metadata, maxQueryResult);
                    }
                    return QueryResult.ofData(data, columns);
                } catch (Exception e) {
                    String error = CommonUtils.getSimpleError(e);
                    return QueryResult.ofError(error);
                }
            }
        });

        return result;
    }

    private QueryResult executeQuery(NamedParameterJdbcTemplate npjt,
                                     String sql,
                                     Map<String, Object> namedParameters,
                                     int resultLimit) {
        // Determine max query result
        final int maxQueryResult = JdbcQueryServiceHelper.calculateMaxQueryResultLimit(appProperties.getMaximumQueryRecords(), resultLimit);

        QueryResult result = npjt.query(sql, namedParameters, new ResultSetExtractor<QueryResult>() {
            @Nullable
            @Override
            public QueryResult extractData(ResultSet rs) {
                try {
                    ResultSetMetaData metadata = rs.getMetaData();
                    String[] columnNames = getColumnNames(metadata);
                    List<Column> columns = getColumnList(metadata);
                    String data = resultSetToJsonString(rs, metadata, maxQueryResult);
                    return QueryResult.ofData(data, columns);
                } catch (Exception e) {
                    String error = CommonUtils.getSimpleError(e);
                    return QueryResult.ofError(error);
                }
            }
        });

        return result;
    }

    public Map<String, Object> getNamedParameters(final List<FilterParameter> filterParams) {
        Map<String, Object> namedParameters = new HashMap<>();
        if (filterParams == null || filterParams.isEmpty()) {
            return namedParameters;
        }

        for (FilterParameter param : filterParams) {
            if (!JdbcQueryServiceHelper.isFilterParameterEmpty(param)) {
                String type = param.getType();
                String name = param.getParam();
                String value = param.getValue();

                if (type.equals(Constants.FILTER_TYPE_USER_ATTRIBUTE)) {
                    namedParameters.put(name, value);
                } else if (type.equals(Constants.FILTER_TYPE_SLICER)) {
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

    private String[] getColumnNames(ResultSetMetaData metadata) throws SQLException {
        int columnCount = metadata.getColumnCount();
        String[] columnNames = new String[columnCount + 1];
        for (int i = 1; i <= columnCount; i++) {
            // Use column label to fetch the column alias instead of using column name.
            // If there is no alias, column label is the same as column name.
            String columnLabel = metadata.getColumnLabel(i);
            columnNames[i] = columnLabel;
        }
        return columnNames;
    }

    private List<Column> getColumnList(ResultSetMetaData metadata) throws SQLException {
        int columnCount = metadata.getColumnCount();
        List<Column> columns = new ArrayList<>();
        for (int i = 1; i <= columnCount; i++) {
            int columnType = metadata.getColumnType(i);;
            String dbType = metadata.getColumnTypeName(i);
            int length = metadata.getColumnDisplaySize(i);
            // Use column label to fetch the column alias instead of using column name.
            // If there is no alias, column label is the same as column name.
            String columnLabel = metadata.getColumnLabel(i);
            columns.add(new Column(columnLabel, JDBC_TYPE_MAP.get(columnType), dbType, length));
        }
        return columns;
    }

    private String resultSetToJsonString(ResultSet rs, ResultSetMetaData metadata, int maxQueryResult) throws SQLException {
        int columnCount = metadata.getColumnCount();
        ObjectMapper mapper = new ObjectMapper();
        ArrayNode array = mapper.createArrayNode();
        int rowCount = 0;
        while (rs.next()) {
            ObjectNode node = mapper.createObjectNode();
            for (int i = 1; i <= columnCount; i++) {
                String columnLabel = metadata.getColumnLabel(i);
                int columnType = metadata.getColumnType(i);
                switch (columnType) {
                    case java.sql.Types.VARCHAR:
                    case java.sql.Types.CHAR:
                    case java.sql.Types.LONGVARCHAR:
                        node.put(columnLabel, rs.getString(i));
                        break;
                    case java.sql.Types.TINYINT:
                    case java.sql.Types.SMALLINT:
                    case java.sql.Types.INTEGER:
                        node.put(columnLabel, rs.getInt(i));
                        break;
                    case java.sql.Types.NUMERIC:
                    case java.sql.Types.DECIMAL:
                        node.put(columnLabel, rs.getBigDecimal(i));
                        break;
                    case java.sql.Types.DOUBLE:
                    case java.sql.Types.FLOAT:
                    case java.sql.Types.REAL:
                        node.put(columnLabel, rs.getDouble(i));
                        break;
                    case java.sql.Types.BOOLEAN:
                    case java.sql.Types.BIT:
                        node.put(columnLabel, rs.getBoolean(i));
                        break;
                    case java.sql.Types.BIGINT:
                        node.put(columnLabel, rs.getLong(i));
                        break;
                    case java.sql.Types.NVARCHAR:
                    case java.sql.Types.NCHAR:
                        node.put(columnLabel, rs.getNString(i));
                        break;
                    default:
                        // Unhandled types
                        node.put(columnLabel, rs.getString(i));
                        break;
                }
            }
            array.add(node);
            rowCount++;
            if (maxQueryResult != Constants.QUERY_RESULT_NOLIMIT && rowCount >= maxQueryResult) {
                break;
            }
        }
        return array.toString();
    }


    private String resultSetToCsvString(ResultSet rs, String[] columnNames, int maxQueryResult) throws SQLException {
        int columnCount = columnNames.length - 1;
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= columnCount; i++) {
            sb.append(columnNames[i]).append(",");
        }
        sb.append("\r\n");

        int rowCount = 0;
        while (rs.next()) {
            for (int i = 1; i <= columnCount; i++) {
                // TODO: handle quotation marks
                sb.append(rs.getString(i)).append(",");
            }
            sb.append("\r\n");
            rowCount++;
            if (maxQueryResult != Constants.QUERY_RESULT_NOLIMIT && rowCount >= maxQueryResult) {
                break;
            }
        }
        return sb.toString();
    }
}
