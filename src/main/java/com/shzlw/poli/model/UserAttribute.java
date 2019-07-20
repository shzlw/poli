package com.shzlw.poli.model;

public class UserAttribute {

    public static final String ATTR_KEY = "attr_key";
    public static final String ATTR_VALUE = "attr_value";

    private String attrKey;
    private String attrValue;

    public UserAttribute() {}

    public String getAttrKey() {
        return attrKey;
    }

    public void setAttrKey(String attrKey) {
        this.attrKey = attrKey;
    }

    public String getAttrValue() {
        return attrValue;
    }

    public void setAttrValue(String attrValue) {
        this.attrValue = attrValue;
    }
}
