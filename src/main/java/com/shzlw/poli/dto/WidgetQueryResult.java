package com.shzlw.poli.dto;

import java.util.List;

public class WidgetQueryResult extends QueryResult {

    /**
     * Widget id
     */
    private long id;

    public WidgetQueryResult(long id, String error) {
        super(error);
        this.id = id;
    }

    public WidgetQueryResult(long id, String data, List<Column> columns) {
        super(data, columns);
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
