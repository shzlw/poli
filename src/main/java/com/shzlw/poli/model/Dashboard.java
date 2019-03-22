package com.shzlw.poli.model;

import java.util.List;

public class Dashboard {

    public static final String TABLE = "p_dashboard";
    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String HEIGHT = "height";

    private long id;
    private String name;
    private int height;

    /**
     * Creator
     */
    private long userId;

    /**
     * public or private
     */
    private String access;

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

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
}
