package com.shzlw.poli.dto;

import com.shzlw.poli.model.User;

import java.util.Set;

public class SharedLinkInfo {

    private User user;
    private long reportId;
    private Set<String> componentQueryUrls;

    public SharedLinkInfo(User user, long reportId, Set<String> componentQueryUrls) {
        this.user = user;
        this.reportId = reportId;
        this.componentQueryUrls = componentQueryUrls;
    }

    public User getUser() {
        return user;
    }

    public long getReportId() {
        return reportId;
    }

    public Set<String> getComponentQueryUrls() {
        return componentQueryUrls;
    }
}
