package com.shzlw.poli.model;

import java.util.ArrayList;
import java.util.List;

public class Group {

    public static final String ID = "id";
    public static final String NAME = "name";

    private long id;
    private String name;

    private List<Long> groupDashboards = new ArrayList<>();

    public Group() {}

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

    public List<Long> getGroupDashboards() {
        return groupDashboards;
    }

    public void setGroupDashboards(List<Long> groupDashboards) {
        this.groupDashboards = groupDashboards;
    }
}
