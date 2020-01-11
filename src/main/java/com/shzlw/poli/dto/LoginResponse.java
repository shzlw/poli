package com.shzlw.poli.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

    private String username;
    private String sysRole;
    private String error;

    @JsonProperty(value = "isTempPassword")
    private boolean isTempPassword;

    public static LoginResponse ofError(String error) {
        return new LoginResponse(error);
    }

    public static LoginResponse ofSuccess(String username, String sysRole, boolean isTempPassword) {
        return new LoginResponse(username, sysRole, isTempPassword);
    }

    private LoginResponse() {};

    private LoginResponse(String error) {
        this.error = error;
    }

    private LoginResponse(String username, String sysRole, boolean isTempPassword) {
        this.username = username;
        this.sysRole = sysRole;
        this.isTempPassword = isTempPassword;
    }

    public String getUsername() {
        return username;
    }

    public String getSysRole() {
        return sysRole;
    }

    public String getError() {
        return error;
    }

    public boolean isTempPassword() {
        return isTempPassword;
    }

    @Override
    public String toString() {
        return "LoginResponse{" +
                "username='" + username + '\'' +
                ", sysRole='" + sysRole + '\'' +
                ", error='" + error + '\'' +
                ", isTempPassword=" + isTempPassword +
                '}';
    }
}
