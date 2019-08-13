package com.shzlw.poli.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

import java.util.Objects;

public class Report {

    public static final String TABLE = "p_report";
    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String STYLE = "style";
    public static final String PROJECT = "project";

    private long id;
    private String name;

    /**
     * Json field
     *
     * {
     *     height: 600,
     *     backgroundColor: '#123456'
     * }
     */
    private String style;

    private String project;

    @JsonProperty(value = "isFavourite")
    private boolean isFavourite;

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

    public String getProject() {
        return project;
    }

    public void setProject(String project) {
        this.project = project;
    }

    public boolean isFavourite() {
        return isFavourite;
    }

    public void setFavourite(boolean favourite) {
        isFavourite = favourite;
    }

    @JsonRawValue
    public String getStyle() {
        return style;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setStyle(String style) {
        this.style = style;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Report report = (Report) o;
        return id == report.id &&
                name.equals(report.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "Report{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", style='" + style + '\'' +
                '}';
    }
}
