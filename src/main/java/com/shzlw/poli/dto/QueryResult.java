package com.shzlw.poli.dto;

import com.shzlw.poli.util.Constants;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class QueryResult {

    private List<Column> columns = new ArrayList<>();

    /**
     * JSON array value
     */
    private String data;
    private String error;

    public static QueryResult ofError(String error) {
        return new QueryResult(error);
    }

    public static QueryResult ofData(String data, List<Column> columns) {
        return new QueryResult(data, columns);
    }

    private QueryResult() {
    }

    private QueryResult(String error) {
        this.error = error;
    }

    private QueryResult(String data, List<Column> columns) {
        this.data = data;
        this.columns = columns;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public String getData() {
        if (StringUtils.isEmpty(data)) {
            return Constants.EMPTY_JSON_ARRAY;
        }
        return data;
    }

    public String getError() {
        return error;
    }
}
