package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.shzlw.poli.dao.ReportDao;
import com.shzlw.poli.model.Report;
import com.shzlw.poli.model.User;
import com.shzlw.poli.util.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class ReportService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ReportService.class);

    /**
     * Key: User id
     * Value: Report
     */
    private static final Cache<Long, List<Report>> USER_REPORT_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    @Autowired
    ReportDao reportDao;

    public List<Report> getReportsByUser(User user) {
        if (StringUtils.isEmpty(user)) {
            return Collections.emptyList();
        }

        try {
            List<Report> rt = USER_REPORT_CACHE.get(user.getId(), () -> {
                List<Report> reports = new ArrayList<>();
                if (Constants.SYS_ROLE_VIEWER.equals(user.getSysRole())) {
                    reports = reportDao.findByViewer(user.getId());
                    LOGGER.info("reports: {}", reports.size());
                } else {
                    reports = reportDao.findAll();
                }

                return reports;
            });
            return rt;
        } catch (ExecutionException | CacheLoader.InvalidCacheLoadException e) {
            return Collections.emptyList();
        }
    }

    public void invalidateCache(long userId) {
        USER_REPORT_CACHE.invalidate(userId);
    }
}
