package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.shzlw.poli.dao.ComponentDao;
import com.shzlw.poli.dao.ReportDao;
import com.shzlw.poli.dao.SharedReportDao;
import com.shzlw.poli.dao.UserDao;
import com.shzlw.poli.dto.SharedLinkInfo;
import com.shzlw.poli.model.Component;
import com.shzlw.poli.model.SharedReport;
import com.shzlw.poli.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class SharedReportService {

    /**
     * Key: Share key
     * Value: SharedLinkInfo
     */
    private static final Cache<String, SharedLinkInfo> SHARE_LINK_INFO_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    @Autowired
    ReportDao reportDao;

    @Autowired
    UserDao userDao;

    @Autowired
    SharedReportDao sharedReportDao;

    @Autowired
    ComponentDao componentDao;

    public SharedLinkInfo getSharedLinkInfoByShareKey(String shareKey) {
        if (StringUtils.isEmpty(shareKey)) {
            return null;
        }

        try {
            SharedLinkInfo info = SHARE_LINK_INFO_CACHE.get(shareKey, () -> {
                User u = userDao.findByShareKey(shareKey);
                u.setUserAttributes(userDao.findUserAttributes(u.getId()));
                SharedReport sharedReport = sharedReportDao.findByShareKey(shareKey);
                long reportId = sharedReport.getReportId();
                List<Component> components = componentDao.findByReportId(reportId);
                Set<String> componentQueryUrls = new HashSet<>();
                for (Component component : components) {
                    componentQueryUrls.add("/ws/jdbcquery/component/" + component.getId());
                }

                return new SharedLinkInfo(u, reportId, componentQueryUrls);
            });
            return info;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return null;
        }
    }

    public void invalidateSharedLinkInfoCacheByShareKey(String shareKey) {
        if (shareKey != null) {
            SHARE_LINK_INFO_CACHE.invalidate(shareKey);
        }
    }

    public void invalidateSharedLinkInfoCacheByUserId(long userId) {
        Map<String, SharedLinkInfo> map = SHARE_LINK_INFO_CACHE.asMap();
        for (Map.Entry<String, SharedLinkInfo> entry : map.entrySet()) {
            SharedLinkInfo linkInfo = entry.getValue();
            if (linkInfo.getUser() != null && linkInfo.getUser().getId() == userId) {
                SHARE_LINK_INFO_CACHE.invalidate(entry.getKey());
            }
        }
    }

    public void invalidateSharedLinkInfoCacheByReportId(long reportId) {
        Map<String, SharedLinkInfo> map = SHARE_LINK_INFO_CACHE.asMap();
        for (Map.Entry<String, SharedLinkInfo> entry : map.entrySet()) {
            SharedLinkInfo linkInfo = entry.getValue();
            if (linkInfo.getReportId() == reportId) {
                SHARE_LINK_INFO_CACHE.invalidate(entry.getKey());
            }
        }
    }
}
