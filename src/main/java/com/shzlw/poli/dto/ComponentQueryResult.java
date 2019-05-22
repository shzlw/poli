package com.shzlw.poli.dto;

import java.util.List;

public class ComponentQueryResult extends QueryResult {

    /**
     * Component id
     */
    private long id;

    public ComponentQueryResult(long id, String error) {
        super(error);
        this.id = id;
    }

    public ComponentQueryResult(long id, String data, List<Column> columns) {
        super(data, columns);
        this.id = id;
    }

    public long getId() {
        return id;
    }
}
