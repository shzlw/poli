package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.shzlw.poli.dao.DashboardDao;
import com.shzlw.poli.dao.WidgetDao;
import com.shzlw.poli.model.Dashboard;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class DashboardService {

    /**
     * Key: User id
     * Value: Dashboard
     */
    private static Cache<Long, List<Dashboard>> USER_DASHBOARD_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build();

    @Autowired
    DashboardDao dashboardDao;

    public List<Dashboard> getDashboardsByUser(User user) {
        if (StringUtils.isEmpty(user)) {
            return Collections.emptyList();
        }

        try {
            List<Dashboard> rt = USER_DASHBOARD_CACHE.get(user.getId(), () -> {
                List<Dashboard> dashboards = new ArrayList<>();
                if (Constants.SYS_ROLE_VIEWER.equals(user.getSysRole())) {
                    dashboards = dashboardDao.findByViewer(user.getId());
                } else {
                    dashboards = dashboardDao.findAll();
                }

                return dashboards;
            });
            return rt;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return Collections.emptyList();
        }
    }

    public void invalidateCache(long userId) {
        USER_DASHBOARD_CACHE.invalidate(userId);
    }
}
