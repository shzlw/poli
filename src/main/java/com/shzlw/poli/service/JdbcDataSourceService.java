package com.shzlw.poli.service;

import com.shzlw.poli.dao.JdbcDataSourceDao;
import com.shzlw.poli.model.JdbcDataSource;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.sql.DataSource;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JdbcDataSourceService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JdbcDataSourceService.class);

    private static final Map<String, HikariDataSource> DATA_SOURCE_CACHE = new ConcurrentHashMap<>();

    @Autowired
    JdbcDataSourceDao jdbcDataSourceDao;

    @PostConstruct
    public void init() {
        List<JdbcDataSource> dataSources = jdbcDataSourceDao.fetchAll();
        for (JdbcDataSource dataSource : dataSources) {
            save(dataSource);
        }
    }

    @PreDestroy
    public void shutdown() {
        for (HikariDataSource ds : DATA_SOURCE_CACHE.values()) {
            ds.close();
        }
    }

    public HikariDataSource save(JdbcDataSource dataSource) {
        LOGGER.info("HikariDataSource - save: {}", dataSource);
        HikariDataSource ds = DATA_SOURCE_CACHE.get(dataSource.getName());
        if (ds != null) {
            ds.close();
        }
        HikariDataSource newDs = new HikariDataSource();
        newDs.setJdbcUrl(dataSource.getConnectionUrl());
        newDs.setUsername(dataSource.getUsername());
        newDs.setPassword(dataSource.getPassword());
        newDs.setDriverClassName(dataSource.getDriverClassName());
        newDs.setMaximumPoolSize(10);
        DATA_SOURCE_CACHE.put(dataSource.getName(), newDs);
        return newDs;
    }


    public void remove(JdbcDataSource dataSource) {
        DATA_SOURCE_CACHE.remove(dataSource.getName());
    }

    public DataSource getDataSource(JdbcDataSource dataSource) {
        HikariDataSource ds = DATA_SOURCE_CACHE.get(dataSource.getName());
        if (ds == null) {
            ds = save(dataSource);
        }
        return ds;
    }
}
