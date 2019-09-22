package com.shzlw.poli.dto;

public class ExportRequest {

    private long reportId;
    private String reportName;
    private String sessionKey;
    private int width;
    private int height;

    public ExportRequest(long reportId, String reportName, String sessionKey, int width, int height) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.sessionKey = sessionKey;
        this.width = width;
        this.height = height;
    }

    public long getReportId() {
        return reportId;
    }

    public void setReportId(long reportId) {
        this.reportId = reportId;
    }

    public String getReportName() {
        return reportName;
    }

    public void setSessionKey(String sessionKey) {
        this.sessionKey = sessionKey;
    }

    public String getSessionKey() {
        return sessionKey;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }
}
