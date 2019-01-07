package com.shzlw.poli.service;

import com.shzlw.poli.model.JdbcDataSource;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class JdbcDataSourceService {

    private Map<String, HikariDataSource> dataSourcesCache = new ConcurrentHashMap<>();

    public void loadAll(List<JdbcDataSource> dataSourceList) {
        for (JdbcDataSource dataSource : dataSourceList) {
            save(dataSource);
        }
    }

    public void save(JdbcDataSource dataSource) {
        HikariDataSource hds = new HikariDataSource();
        hds.setJdbcUrl(dataSource.getConnectionUrl());
        hds.setUsername(dataSource.getUsername());
        hds.setPassword(dataSource.getPassword());
        dataSourcesCache.put(dataSource.getName(), hds);
    }

    public void delete(JdbcDataSource dataSource) {
        dataSourcesCache.remove(dataSource);
    }

    public Connection getConnection(String name) throws SQLException {
        HikariDataSource ds = dataSourcesCache.get(name);
        return ds.getConnection();
    }
}
