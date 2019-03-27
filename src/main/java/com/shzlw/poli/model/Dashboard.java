package com.shzlw.poli.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.shzlw.poli.util.RawStringDeserialzier;

public class Dashboard {

    public static final String TABLE = "p_dashboard";
    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String STYLE = "style";

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

    @JsonRawValue
    public String getStyle() {
        return style;
    }

    @JsonDeserialize(using = RawStringDeserialzier.class)
    public void setStyle(String style) {
        this.style = style;
    }
}
