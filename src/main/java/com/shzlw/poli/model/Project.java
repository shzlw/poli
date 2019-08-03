package com.shzlw.poli.model;

import java.util.ArrayList;
import java.util.List;

public class Project {

    public static final String ID = "id";
    public static final String NAME = "name";

    private long id;
    private String name;
    private String description;
    private List<Long> reports = new ArrayList<>();

    public Project() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Long> getReports() {
        return reports;
    }

    public void setReports(List<Long> reports) {
        this.reports = reports;
    }
}
