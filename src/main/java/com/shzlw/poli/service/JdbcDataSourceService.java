package com.shzlw.poli.service;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.RemovalListener;
import com.google.common.cache.RemovalNotification;
import com.shzlw.poli.SystemProperties;
import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.JdbcDataSource;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
public class JdbcDataSourceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JdbcDataSourceService.class);

    /**
     * Key: JdbcDataSource id
     * Value: HikariDataSource
     */
    private static Cache<Long, HikariDataSource> DATA_SOURCE_CACHE = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .removalListener((RemovalListener<Long, HikariDataSource>) removal -> {
                HikariDataSource ds = removal.getValue();
                ds.close();
            })
            .build();

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @Autowired
    SystemProperties systemProperties;

    @PostConstruct
    public void init() {
    }

    @PreDestroy
    public void shutdown() {
        for (HikariDataSource hiDs : DATA_SOURCE_CACHE.asMap().values()) {
            hiDs.close();
        }
    }

    public void removeFromCache(long dataSourceId) {
        DATA_SOURCE_CACHE.invalidate(dataSourceId);
    }

    public DataSource getDataSource(long dataSourceId) {
        LOGGER.info("[poli] getDataSource - dataSourceId: {}, size: {}", dataSourceId, DATA_SOURCE_CACHE.asMap().size());
        try {
            DataSource hiDs = DATA_SOURCE_CACHE.get(dataSourceId, () -> {
                JdbcDataSource dataSource = jdbcDataSourceDao.findById(dataSourceId);
                if (dataSource == null) {
                    return null;
                }
                HikariDataSource newHiDs = new HikariDataSource();
                newHiDs.setJdbcUrl(dataSource.getConnectionUrl());
                newHiDs.setUsername(dataSource.getUsername());
                newHiDs.setPassword(dataSource.getPassword());
                if (!StringUtils.isEmpty(dataSource.getDriverClassName())) {
                    newHiDs.setDriverClassName(dataSource.getDriverClassName());
                }
                newHiDs.setMaximumPoolSize(systemProperties.getDataSourceMaximumPoolSize());
                newHiDs.setLeakDetectionThreshold(2000);
                LOGGER.info("[poli] getDataSource - put: {}, size: {}", newHiDs, DATA_SOURCE_CACHE.asMap().size());
                return newHiDs;
            });
            return hiDs;
        } catch (ExecutionException e) {
            return null;
        }
    }
}
