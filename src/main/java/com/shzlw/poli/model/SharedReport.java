package com.shzlw.poli.model;

public class SharedReport {

    public static final String ID = "id";
    public static final String SHARE_KEY = "share_key";
    public static final String REPORT_ID = "report_id";
    public static final String REPORT_TYPE = "report_type";
    public static final String USER_ID = "user_id";
    public static final String CREATED_AT = "created_at";
    public static final String EXPIRED_BY = "expired_by";

    private long id;
    private String shareKey;
    private long reportId;
    private String reportType;
    private long userId;
    private long createdAt;
    private long expiredBy;

    public SharedReport() {}

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getShareKey() {
        return shareKey;
    }

    public void setShareKey(String shareKey) {
        this.shareKey = shareKey;
    }

    public long getReportId() {
        return reportId;
    }

    public void setReportId(long reportId) {
        this.reportId = reportId;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(long createdAt) {
        this.createdAt = createdAt;
    }

    public long getExpiredBy() {
        return expiredBy;
    }

    public void setExpiredBy(long expiredBy) {
        this.expiredBy = expiredBy;
    }
}
