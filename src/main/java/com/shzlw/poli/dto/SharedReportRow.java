package com.shzlw.poli.dto;

import com.shzlw.poli.model.SharedReport;

public class SharedReportRow extends SharedReport {

    public static final String REPORT_NAME = "report_name";
    public static final String CREATED_BY = "created_by";

    private String reportName;
    private String createdBy;
    private String createDateTime;
    private String expirationDate;

    public SharedReportRow() {}

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreateDateTime() {
        return createDateTime;
    }

    public void setCreateDateTime(String createDateTime) {
        this.createDateTime = createDateTime;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }
}
