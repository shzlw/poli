package com.shzlw.poli.dto;

public class AppInfo {

    private String version;
    private String localeLanguage;

    public AppInfo(String version, String localeLanguage) {
        this.version = version;
        this.localeLanguage = localeLanguage;
    }

    public String getVersion() {
        return version;
    }

    public String getLocaleLanguage() {
        return localeLanguage;
    }
}
