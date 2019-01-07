package com.shzlw.poli.model;

import java.util.List;

public class Board {

    public static final String TABLE = "p_board";
    public static final String ID = "id";
    public static final String NAME = "name";
    public static final String WIDTH = "width";
    public static final String HEIGHT = "height";

    private long id;
    private String name;
    private int width;
    private int height;

    private List<Filter> filters;
    private List<Card> cards;

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

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }
}
