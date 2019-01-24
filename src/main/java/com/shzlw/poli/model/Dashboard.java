package com.shzlw.poli.model;

import java.util.List;

public class Dashboard {

    public static final String TABLE = "p_dashboard";
    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String WIDTH = "width";
    public static final String HEIGHT = "height";

    private long id;
    private String name;
    private int width;
    private int height;

    /**
     * Creator
     */
    private long userId;

    /**
     * public or private
     */
    private String access;

    private List<Filter> filters;
    private List<Widget> widgets;

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

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public List<Filter> getFilters() {
        return filters;
    }

    public void setFilters(List<Filter> filters) {
        this.filters = filters;
    }

    public static String getTABLE() {
        return TABLE;
    }

    public static String getID() {
        return ID;
    }

    public static String getNAME() {
        return NAME;
    }

    public static String getWIDTH() {
        return WIDTH;
    }

    public static String getHEIGHT() {
        return HEIGHT;
    }

    public List<Widget> getWidgets() {
        return widgets;
    }

    public void setWidgets(List<Widget> widgets) {
        this.widgets = widgets;
    }
}
