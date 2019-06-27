package com.shzlw.poleo.dto;

import java.util.ArrayList;
import java.util.List;

public class Table {

    private String name;
    private String type;
    private List<Column> columns = new ArrayList<>();

    public Table(String name, String type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public List<Column> getColumns() {
        return columns;
    }

    public void setColumns(List<Column> columns) {
        this.columns = columns;
    }
}
